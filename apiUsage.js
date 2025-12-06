const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const apiUsageSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true
  },
  endpoint: {
    type: String,
    required: true,
    enum: ['firehose', 'sponsors', 'search', 'stats']
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'STREAM'],
    default: 'GET'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  responseTime: {
    type: Number
  },
  statusCode: {
    type: Number
  },
  userAgent: {
    type: String
  },
  ipAddress: {
    type: String
  },
  type: {
    type: String,
    enum: ['http_request', 'stream_message', 'websocket_message'],
    default: 'http_request'
  },
  dataSize: {
    type: Number
  },
  requestId: {
    type: String
  },
  filters: {
    category: String,
    dateRange: {
      from: Date,
      to: Date
    },
    audience: {
      min: Number,
      max: Number
    }
  },
  resultCount: {
    type: Number
  }
});

apiUsageSchema.index({ userId: 1, timestamp: -1 });
apiUsageSchema.index({ endpoint: 1, timestamp: -1 });
apiUsageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

apiUsageSchema.statics.getUsageStats = function(userId, timeframe = '24h') {
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
    case '30d':
      startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        timestamp: { $gte: startTime }
      }
    },
    {
      $group: {
        _id: {
          endpoint: '$endpoint',
          type: '$type'
        },
        count: { $sum: 1 },
        avgResponseTime: { $avg: '$responseTime' },
        totalDataSize: { $sum: '$dataSize' },
        errors: {
          $sum: {
            $cond: [{ $gte: ['$statusCode', 400] }, 1, 0]
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id.endpoint',
        totalRequests: { $sum: '$count' },
        avgResponseTime: { $avg: '$avgResponseTime' },
        totalDataTransferred: { $sum: '$totalDataSize' },
        errorRate: { 
          $avg: { 
            $divide: ['$errors', '$count'] 
          } 
        },
        types: {
          $push: {
            type: '$_id.type',
            count: '$count'
          }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('ApiUsage', apiUsageSchema);