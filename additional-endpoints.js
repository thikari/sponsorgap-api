const express = require('express');
const router = express.Router();
const sponsors = require('./models/sponsors');
const { authenticateApiKey, checkRateLimit } = require('./apiAuth');

// Apply authentication to all routes
router.use(authenticateApiKey);

// Industries endpoint
router.get('/industries', checkRateLimit, async (req, res) => {
  try {
    const industries = await sponsors.aggregate([
      { $group: { _id: '$industryfield', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { industry: '$_id', sponsorCount: '$count', _id: 0 } }
    ]);

    res.json({
      success: true,
      data: industries,
      meta: {
        total: industries.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch industries',
      message: error.message
    });
  }
});

// Industry-specific sponsors
router.get('/industries/:industry/sponsors', checkRateLimit, async (req, res) => {
  try {
    const { industry } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 500);
    const offset = parseInt(req.query.offset) || 0;
    const deduplicate = req.query.deduplicate === 'true';

    const query = {
      industryfield: new RegExp(industry, 'i')
    };

    // Add additional filters
    if (req.query.audience_min) query.audience = { $gte: parseInt(req.query.audience_min) };
    if (req.query.audience_max) {
      query.audience = query.audience || {};
      query.audience.$lte = parseInt(req.query.audience_max);
    }

    let sponsorsData, totalCount;

    if (deduplicate) {
      // Use aggregation to get unique sponsors
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
              { $limit: limit },
              {
                $project: {
                  __v: 0
                }
              }
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

    res.json({
      success: true,
      data: sponsorsData,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasNext: offset + limit < totalCount
      },
      deduplicated: deduplicate,
      meta: {
        industry,
        filters: req.query,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch industry sponsors',
      message: error.message
    });
  }
});

// Brand search endpoint
router.get('/brands/search', checkRateLimit, async (req, res) => {
  try {
    const { q: query, limit = 25, offset = 0 } = req.query;
    const deduplicate = req.query.deduplicate === 'true';

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query required',
        message: 'Please provide a search query parameter "q"'
      });
    }

    const searchRegex = new RegExp(query, 'i');
    const searchQuery = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { link: searchRegex }
      ]
    };

    let results, totalCount;

    if (deduplicate) {
      // Use aggregation to get unique brands (deduplicated by company name)
      const pipeline = [
        { $match: searchQuery },
        { $sort: { audience: -1, created: -1 } },
        {
          $group: {
            _id: '$name',
            doc: { $first: '$$ROOT' }
          }
        },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: { audience: -1, created: -1 } },
        {
          $facet: {
            data: [
              { $skip: parseInt(offset) },
              { $limit: parseInt(limit) },
              {
                $project: {
                  name: 1,
                  logo: 1,
                  link: 1,
                  industryfield: 1,
                  category: 1,
                  audience: 1,
                  created: 1,
                  contactinfo: 1,
                  linkedin: 1
                }
              }
            ],
            totalCount: [
              { $count: 'count' }
            ]
          }
        }
      ];

      const result = await sponsors.aggregate(pipeline);
      results = result[0].data;
      totalCount = result[0].totalCount[0]?.count || 0;
    } else {
      // Regular search without deduplication
      [results, totalCount] = await Promise.all([
        sponsors.find(searchQuery)
          .select('name logo link industryfield category audience created contactinfo linkedin')
          .sort({ audience: -1, created: -1 })
          .limit(parseInt(limit))
          .skip(parseInt(offset))
          .lean(),
        sponsors.countDocuments(searchQuery)
      ]);
    }

    res.json({
      success: true,
      data: results,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasNext: parseInt(offset) + parseInt(limit) < totalCount
      },
      deduplicated: deduplicate,
      meta: {
        query,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

// Trending sponsors (most active in last 7 days)
router.get('/sponsors/trending', checkRateLimit, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const deduplicate = req.query.deduplicate === 'true';

    let trending;

    if (deduplicate) {
      // Use aggregation to get unique trending sponsors
      const pipeline = [
        {
          $match: {
            $or: [
              { created: { $gte: cutoffDate } },
              { sponsordate: { $gte: cutoffDate } }
            ]
          }
        },
        { $sort: { created: -1, audience: -1 } },
        {
          $group: {
            _id: '$name',
            doc: { $first: '$$ROOT' }
          }
        },
        { $replaceRoot: { newRoot: '$doc' } },
        { $sort: { created: -1, audience: -1 } },
        { $limit: limit },
        {
          $project: {
            name: 1,
            logo: 1,
            link: 1,
            industryfield: 1,
            category: 1,
            audience: 1,
            created: 1,
            sponsordate: 1,
            contactinfo: 1,
            linkedin: 1
          }
        }
      ];

      trending = await sponsors.aggregate(pipeline);
    } else {
      // Regular query without deduplication
      trending = await sponsors.find({
        $or: [
          { created: { $gte: cutoffDate } },
          { sponsordate: { $gte: cutoffDate } }
        ]
      })
      .select('name logo link industryfield category audience created sponsordate contactinfo linkedin')
      .sort({ created: -1, audience: -1 })
      .limit(limit)
      .lean();
    }

    res.json({
      success: true,
      data: trending,
      deduplicated: deduplicate,
      meta: {
        timeframe: `${days} days`,
        count: trending.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending sponsors',
      message: error.message
    });
  }
});

// Audience size ranges endpoint
router.get('/audience/ranges', checkRateLimit, async (req, res) => {
  try {
    const ranges = await sponsors.aggregate([
      {
        $bucket: {
          groupBy: '$audience',
          boundaries: [0, 1000, 5000, 10000, 25000, 50000, 100000, 500000, 1000000, Infinity],
          default: 'Unknown',
          output: {
            count: { $sum: 1 },
            avgAudience: { $avg: '$audience' },
            examples: { $push: { name: '$name', audience: '$audience' } }
          }
        }
      },
      {
        $project: {
          range: '$_id',
          count: 1,
          avgAudience: { $round: ['$avgAudience', 0] },
          examples: { $slice: ['$examples', 3] }
        }
      }
    ]);

    res.json({
      success: true,
      data: ranges,
      meta: {
        description: 'Sponsor distribution by audience size ranges',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audience ranges',
      message: error.message
    });
  }
});

// Market overview analytics
router.get('/analytics/market-overview', checkRateLimit, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30d';
    let startDate;
    
    switch(timeframe) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const [
      totalSponsors,
      newSponsors,
      topIndustries,
      audienceStats,
      activityTrend
    ] = await Promise.all([
      sponsors.countDocuments(),
      sponsors.countDocuments({ created: { $gte: startDate } }),
      sponsors.aggregate([
        { $group: { _id: '$industryfield', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      sponsors.aggregate([
        {
          $group: {
            _id: null,
            avgAudience: { $avg: '$audience' },
            maxAudience: { $max: '$audience' },
            minAudience: { $min: '$audience' }
          }
        }
      ]),
      sponsors.aggregate([
        {
          $match: { created: { $gte: startDate } }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$created' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalSponsors,
          newSponsors,
          growthRate: totalSponsors > 0 ? ((newSponsors / totalSponsors) * 100).toFixed(2) + '%' : '0%'
        },
        topIndustries: topIndustries.slice(0, 5),
        audienceInsights: audienceStats[0] || {},
        activityTrend: activityTrend,
        timeframe
      },
      meta: {
        timestamp: new Date().toISOString(),
        period: timeframe
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market overview',
      message: error.message
    });
  }
});

module.exports = router;