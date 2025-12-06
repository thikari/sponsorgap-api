const crypto = require('crypto');
const User = require('./models/users');

class ApiKeyService {
  generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  async createApiKey(userId) {
    try {
      const apiKey = this.generateApiKey();
      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
      
      const user = await User.findByIdAndUpdate(
        userId,
        {
          apiKey: hashedKey,
          apiKeyCreated: new Date(),
          firehoseAccess: true
        },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return {
        apiKey,
        user
      };
    } catch (error) {
      throw new Error(`Failed to create API key: ${error.message}`);
    }
  }

  async validateApiKey(apiKey) {
    try {
      if (!apiKey) {
        return null;
      }

      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
      
      const user = await User.findOne({ 
        apiKey: hashedKey,
        tier: 'enterprise',
        firehoseAccess: true
      });

      if (user) {
        await User.findByIdAndUpdate(user._id, {
          apiKeyLastUsed: new Date()
        });
      }

      return user;
    } catch (error) {
      console.error('API key validation error:', error);
      return null;
    }
  }

  async revokeApiKey(userId) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $unset: {
            apiKey: 1,
            apiKeyCreated: 1,
            apiKeyLastUsed: 1
          },
          firehoseAccess: false,
          activeConnections: 0
        },
        { new: true }
      );

      return user;
    } catch (error) {
      throw new Error(`Failed to revoke API key: ${error.message}`);
    }
  }

  async checkRateLimit(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return false;
      }

      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const hourlyUsage = await this.getHourlyUsage(userId, hourAgo, now);
      
      return hourlyUsage < user.firehoseRateLimit;
    } catch (error) {
      console.error('Rate limit check error:', error);
      return false;
    }
  }

  async incrementUsage(userId) {
    try {
      const ApiUsage = require('../models/apiUsage');
      
      await ApiUsage.create({
        userId,
        endpoint: 'firehose',
        timestamp: new Date(),
        type: 'stream_message'
      });
    } catch (error) {
      console.error('Usage tracking error:', error);
    }
  }

  async getHourlyUsage(userId, startTime, endTime) {
    try {
      const ApiUsage = require('../models/apiUsage');
      
      const count = await ApiUsage.countDocuments({
        userId,
        timestamp: {
          $gte: startTime,
          $lte: endTime
        }
      });
      
      return count;
    } catch (error) {
      console.error('Usage calculation error:', error);
      return 0;
    }
  }

  async trackConnection(userId, action) {
    try {
      const increment = action === 'connect' ? 1 : -1;
      
      await User.findByIdAndUpdate(userId, {
        $inc: { activeConnections: increment }
      });
    } catch (error) {
      console.error('Connection tracking error:', error);
    }
  }

  async checkConnectionLimit(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return false;
      }

      return user.activeConnections < user.firehoseConnectionsLimit;
    } catch (error) {
      console.error('Connection limit check error:', error);
      return false;
    }
  }
}

module.exports = new ApiKeyService();