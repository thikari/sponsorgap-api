require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false
}));

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.DATABASE || 'mongodb://localhost/sponsors', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB');
});

// Import API routes and middleware
const { router: firehoseRouter } = require('./firehose');
const additionalEndpoints = require('./additional-endpoints');
const { authenticateApiKey } = require('./apiAuth');

// API Info endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'SponsorGap Enterprise API',
    version: '1.0.0',
    endpoints: {
      stats: 'GET /v1/stats - API usage statistics and limits',
      historical: 'GET /v1/historical - Historical sponsor data with filtering (supports ?deduplicate=true)',
      stream: 'GET /v1/stream - Real-time sponsor data stream',
      industries: 'GET /v1/industries - List all industries with sponsor counts',
      industry_sponsors: 'GET /v1/industries/:industry/sponsors - Get sponsors in specific industry (supports ?deduplicate=true)',
      brands_search: 'GET /v1/brands/search - Search brands by name, description, or website (supports ?deduplicate=true)',
      trending: 'GET /v1/sponsors/trending - Most active sponsors in recent days (supports ?deduplicate=true)',
      audience_ranges: 'GET /v1/audience/ranges - Sponsor distribution by audience size ranges',
      market_overview: 'GET /v1/analytics/market-overview - Comprehensive market insights and analytics'
    },
    features: {
      deduplication: 'Add ?deduplicate=true to any endpoint to remove duplicate companies and return only unique entries',
      contact_fields: 'All endpoints now include contact_email and linkedin fields for sponsor contact information'
    },
    authentication: 'API Key required in X-API-Key header',
    documentation: 'https://github.com/thikari/sponsorgap-api/tree/main',
    support: 'api@sponsorgap.com'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Mount API routes at /v1
app.use('/v1', firehoseRouter);
app.use('/v1', additionalEndpoints);

// 404 handler for API
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: 'Available endpoints: /v1/stats, /v1/historical, /v1/stream, /v1/industries, /v1/industries/:industry/sponsors, /v1/brands/search, /v1/sponsors/trending, /v1/audience/ranges, /v1/analytics/market-overview',
    available_endpoints: [
      'GET /v1/stats',
      'GET /v1/historical', 
      'GET /v1/stream',
      'GET /v1/industries',
      'GET /v1/industries/:industry/sponsors',
      'GET /v1/brands/search',
      'GET /v1/sponsors/trending',
      'GET /v1/audience/ranges', 
      'GET /v1/analytics/market-overview'
    ],
    path: req.originalUrl
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: 'Something went wrong processing your request'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SponsorGap API Server running on port ${PORT}`);
  console.log(`📡 Core endpoints: /v1/stats, /v1/historical, /v1/stream`);
  console.log(`🔍 Search endpoints: /v1/brands/search, /v1/sponsors/trending`);
  console.log(`📊 Analytics endpoints: /v1/industries, /v1/audience/ranges, /v1/analytics/market-overview`);
  console.log(`📚 Documentation: https://github.com/thikari/sponsorgap-api/tree/main`);
});