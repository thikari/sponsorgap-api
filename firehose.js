const express = require('express');
const router = express.Router();
const { authenticateApiKey, checkConnectionLimit, checkRateLimit } = require('./apiAuth');
const apiKeyService = require('./apiKeyService');
const sponsors = require('./models/sponsors');
const ApiUsage = require('./models/apiUsage');
const EventEmitter = require('events');

const firehoseEmitter = new EventEmitter();
firehoseEmitter.setMaxListeners(100);

router.use(authenticateApiKey);

router.get('/stream', checkConnectionLimit, async (req, res) => {
  const userId = req.userId;
  const requestId = require('crypto').randomBytes(16).toString('hex');
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control, X-API-Key, Authorization',
    'X-Request-ID': requestId
  });

  const filters = {
    category: req.query.category,
    audience_min: parseInt(req.query.audience_min) || 0,
    audience_max: parseInt(req.query.audience_max),
    industry: req.query.industry,
    since: req.query.since ? new Date(req.query.since) : null
  };

  await apiKeyService.trackConnection(userId, 'connect');

  const sendMessage = (type, data) => {
    const message = {
      id: require('crypto').randomBytes(8).toString('hex'),
      timestamp: new Date().toISOString(),
      type,
      data,
      requestId
    };

    res.write(`data: ${JSON.stringify(message)}\n\n`);
    
    apiKeyService.incrementUsage(userId);
  };

  sendMessage('connection', {
    status: 'connected',
    filters,
    message: 'Firehose stream connected successfully'
  });

  const heartbeatInterval = setInterval(() => {
    sendMessage('heartbeat', {
      timestamp: new Date().toISOString(),
      active_connections: req.user.activeConnections
    });
  }, 30000);

  const sponsorListener = (sponsorData) => {
    if (shouldIncludeSponsor(sponsorData, filters)) {
      sendMessage('sponsor_update', {
        action: sponsorData.action,
        sponsor: sanitizeSponsorData(sponsorData.sponsor)
      });
    }
  };

  firehoseEmitter.on('sponsor_change', sponsorListener);

  req.on('close', async () => {
    clearInterval(heartbeatInterval);
    firehoseEmitter.removeListener('sponsor_change', sponsorListener);
    await apiKeyService.trackConnection(userId, 'disconnect');
    
    await ApiUsage.create({
      userId,
      endpoint: 'firehose',
      method: 'STREAM',
      type: 'stream_message',
      requestId,
      filters,
      timestamp: new Date()
    });
  });

  res.write(`data: ${JSON.stringify({
    type: 'stream_ready',
    message: 'Stream initialized, listening for sponsor updates'
  })}\n\n`);
});

router.get('/historical', checkRateLimit, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
    const offset = parseInt(req.query.offset) || 0;
    const since = req.query.since ? new Date(req.query.since) : new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deduplicate = req.query.deduplicate === 'true';

    let query = {
      created: { $gte: since }
    };

    if (req.query.category) {
      query.category = new RegExp(req.query.category, 'i');
    }

    if (req.query.industry) {
      query.industryfield = new RegExp(req.query.industry, 'i');
    }

    if (req.query.audience_min || req.query.audience_max) {
      query.audience = {};
      if (req.query.audience_min) query.audience.$gte = parseInt(req.query.audience_min);
      if (req.query.audience_max) query.audience.$lte = parseInt(req.query.audience_max);
    }

    let sponsorsData, totalCount;

    if (deduplicate) {
      // Use aggregation to get unique sponsors (deduplicated by company name)
      const pipeline = [
        { $match: query },
        { $sort: { created: -1 } },
        {
          $group: {
            _id: '$name',
            doc: { $first: '$$ROOT' }
          }
        },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: { created: -1 } },
        {
          $facet: {
            data: [
              { $skip: offset },
              { $limit: limit }
            ],
            totalCount: [
              { $count: 'count' }
            ]
          }
        }
      ];

      const result = await sponsors.aggregate(pipeline);
      sponsorsData = result[0].data;
      totalCount = result[0].totalCount[0]?.count || 0;
    } else {
      // Regular query without deduplication
      [sponsorsData, totalCount] = await Promise.all([
        sponsors.find(query)
          .select('-__v')
          .sort({ created: -1 })
          .limit(limit)
          .skip(offset)
          .lean(),
        sponsors.countDocuments(query)
      ]);
    }

    const sanitizedSponsors = sponsorsData.map(sanitizeSponsorData);

    await ApiUsage.create({
      userId: req.userId,
      endpoint: 'firehose',
      method: 'GET',
      type: 'http_request',
      resultCount: sanitizedSponsors.length,
      filters: {
        category: req.query.category,
        industry: req.query.industry,
        dateRange: { from: since, to: new Date() },
        audience: {
          min: req.query.audience_min,
          max: req.query.audience_max
        }
      }
    });

    res.json({
      success: true,
      data: sanitizedSponsors,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasNext: offset + limit < totalCount
      },
      filters: query,
      deduplicated: deduplicate,
      meta: {
        requestId: require('crypto').randomBytes(16).toString('hex'),
        timestamp: new Date().toISOString(),
        processing_time: `${Date.now() - req.startTime}ms`
      }
    });
  } catch (error) {
    console.error('Historical data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data',
      message: error.message
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '24h';
    const userId = req.userId;

    const [sponsorStats, usageStats] = await Promise.all([
      getSponsorStats(timeframe),
      ApiUsage.getUsageStats(userId, timeframe)
    ]);

    res.json({
      success: true,
      data: {
        sponsor_stats: sponsorStats,
        usage_stats: usageStats,
        timeframe,
        user_limits: {
          rate_limit: req.user.firehoseRateLimit,
          connection_limit: req.user.firehoseConnectionsLimit,
          current_connections: req.user.activeConnections
        }
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message
    });
  }
});

function shouldIncludeSponsor(sponsorData, filters) {
  const sponsor = sponsorData.sponsor;
  
  if (filters.category && !sponsor.category?.match(new RegExp(filters.category, 'i'))) {
    return false;
  }
  
  if (filters.industry && !sponsor.industryfield?.match(new RegExp(filters.industry, 'i'))) {
    return false;
  }
  
  if (filters.audience_min && sponsor.audience < filters.audience_min) {
    return false;
  }
  
  if (filters.audience_max && sponsor.audience > filters.audience_max) {
    return false;
  }
  
  if (filters.since && sponsor.created < filters.since) {
    return false;
  }
  
  return true;
}

function sanitizeSponsorData(sponsor) {
  return {
    id: sponsor._id,
    name: sponsor.name,
    logo: sponsor.logo,
    website: sponsor.link,
    industry: sponsor.industryfield,
    category: sponsor.category,
    audience: sponsor.audience,
    ad_type: sponsor.adtype,
    sponsor_of: sponsor.sponsorof,
    description: sponsor.description,
    contact_email: sponsor.contactinfo,
    linkedin: sponsor.linkedin,
    created: sponsor.created,
    last_seen: sponsor.sponsordate
  };
}

async function getSponsorStats(timeframe) {
  const now = new Date();
  let startTime;
  
  switch(timeframe) {
    case '1h':
      startTime = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '24h':
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    default:
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  const [newSponsors, totalSponsors, categoryCounts] = await Promise.all([
    sponsors.countDocuments({ created: { $gte: startTime } }),
    sponsors.countDocuments(),
    sponsors.aggregate([
      { $group: { _id: '$industryfield', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    new_sponsors: newSponsors,
    total_sponsors: totalSponsors,
    top_categories: categoryCounts,
    timeframe
  };
}

function notifySponsorChange(action, sponsor) {
  firehoseEmitter.emit('sponsor_change', { action, sponsor });
}

module.exports = { router, notifySponsorChange };