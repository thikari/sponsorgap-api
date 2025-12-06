const apiKeyService = require('./apiKeyService');

const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key required',
        message: 'Please provide an API key in the X-API-Key header or Authorization header'
      });
    }

    const user = await apiKeyService.validateApiKey(apiKey);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key',
        message: 'The provided API key is invalid or expired'
      });
    }

    if (user.tier !== 'enterprise' && user.tier !== 'pro') {
      return res.status(403).json({
        success: false,
        error: 'Insufficient privileges',
        message: 'Premium or Enterprise plan required for API access'
      });
    }

    if (!user.firehoseAccess) {
      return res.status(403).json({
        success: false,
        error: 'Firehose access denied',
        message: 'Your account does not have firehose API access enabled'
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error('API authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: 'Internal server error during authentication'
    });
  }
};

const checkConnectionLimit = async (req, res, next) => {
  try {
    const canConnect = await apiKeyService.checkConnectionLimit(req.userId);
    
    if (!canConnect) {
      return res.status(429).json({
        success: false,
        error: 'Connection limit exceeded',
        message: `Maximum concurrent connections (${req.user.firehoseConnectionsLimit}) reached`
      });
    }

    next();
  } catch (error) {
    console.error('Connection limit check error:', error);
    res.status(500).json({
      success: false,
      error: 'Connection limit check failed',
      message: 'Internal server error'
    });
  }
};

const checkRateLimit = async (req, res, next) => {
  try {
    const withinLimit = await apiKeyService.checkRateLimit(req.userId);
    
    if (!withinLimit) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: `Hourly rate limit (${req.user.firehoseRateLimit}) exceeded`
      });
    }

    next();
  } catch (error) {
    console.error('Rate limit check error:', error);
    res.status(500).json({
      success: false,
      error: 'Rate limit check failed',
      message: 'Internal server error'
    });
  }
};

module.exports = {
  authenticateApiKey,
  checkConnectionLimit,
  checkRateLimit
};