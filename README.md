# SponsorGap Enterprise API

[![API Status](https://img.shields.io/badge/API-Live-brightgreen)](https://api.sponsorgap.com)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)](https://api.sponsorgap.com)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)
[![Enterprise](https://img.shields.io/badge/Plan-Enterprise%20Only-purple)](https://sponsorgap.com/pricing)

Real-time sponsor data API for enterprise users. Access comprehensive sponsor intelligence, market analytics, and live sponsorship activity data.

## 🚀 Live API

**Base URL:** `https://api.sponsorgap.com`

## 📖 Documentation

- **Interactive Docs:** [API Reference](https://docs.scalar.com/sponsorgap-api) (Coming Soon)
- **OpenAPI Spec:** [openapi.yaml](./openapi.yaml)
- **Markdown Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔑 Authentication

All endpoints require an enterprise API key:
```bash
curl -H "X-API-Key: your_enterprise_api_key" https://api.sponsorgap.com/v1/stats
```

## 📊 Available Endpoints

### Core Data Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API service information |
| `/health` | GET | Health check |
| `/v1/stats` | GET | Usage statistics and sponsor insights |
| `/v1/historical` | GET | Historical sponsor data with filtering |
| `/v1/stream` | GET | Real-time sponsor updates (SSE) |

### Industry & Discovery Endpoints  
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/industries` | GET | List all available industries with sponsor counts |
| `/v1/industries/{industry}/sponsors` | GET | Get sponsors by specific industry |
| `/v1/brands/search` | GET | Search brands by name with fuzzy matching |
| `/v1/sponsors/trending` | GET | Get trending sponsors (most active recently) |

### Analytics & Insights Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/analytics/market-overview` | GET | Comprehensive market analysis and trends |
| `/v1/audience/ranges` | GET | Sponsor distribution by audience size ranges |

## 🔥 Quick Start

### Core Data Access
```bash
# Get recent sponsors with filters
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/historical?limit=10&category=Technology"

# Real-time sponsor updates 
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/stream?audience_min=10000"

# API usage statistics
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/stats"
```

### Industry & Brand Discovery
```bash
# Get all available industries
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/industries"

# Find technology sponsors
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/industries/Technology/sponsors?limit=20"

# Search for specific brands
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/brands/search?q=Microsoft&limit=5"

# Get trending sponsors (last 7 days)
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/sponsors/trending?days=7&limit=15"
```

### Analytics & Market Insights
```bash
# Comprehensive market overview
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/analytics/market-overview?timeframe=30d"

# Audience size distribution analysis
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/audience/ranges"
```

## 📋 Rate Limits & Usage

- **HTTP Requests:** 1,000 per hour per API key
- **Concurrent Streams:** 5 simultaneous connections
- **Enterprise Only:** Requires enterprise plan subscription
- **Response Format:** JSON with consistent success/error structure
- **Pagination:** Configurable limits (1-1000 results per request)

## 📝 Response Format

All API responses follow a consistent structure:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 1250,
    "limit": 100,
    "offset": 0,
    "hasNext": true
  },
  "meta": {
    "timestamp": "2025-12-06T20:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### Example Sponsor Data Structure
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "TechCorp Inc",
  "logo": "https://example.com/logo.png",
  "website": "https://techcorp.com",
  "industry": "Technology",
  "category": "Software",
  "audience": 50000,
  "ad_type": "Newsletter Sponsorship",
  "sponsor_of": "TechNewsletter Weekly",
  "created": "2025-12-06T19:00:00.000Z"
}
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Add your DATABASE connection string

# Start development server
npm run dev

# Start production server
npm start
```

## ⭐ Key Features

- **🔍 Advanced Search:** Find sponsors by industry, brand name, audience size
- **📊 Market Analytics:** Comprehensive insights and trend analysis  
- **🔥 Real-time Updates:** Live sponsor activity via Server-Sent Events
- **🎯 Smart Filtering:** Target sponsors by category, audience, and more
- **📈 Trending Data:** Discover the most active sponsors recently
- **🏭 Industry Insights:** Deep-dive into specific industry segments

## 🏗️ Architecture

- **Framework:** Express.js with MongoDB Atlas
- **Authentication:** Enterprise API Key validation
- **Real-time:** Server-Sent Events (SSE) streaming
- **Rate Limiting:** 1,000 requests/hour, 5 concurrent streams
- **Deployment:** Heroku with auto-scaling
- **Documentation:** OpenAPI 3.0 + Scalar interactive docs
- **Data Models:** 25+ comprehensive sponsor data fields

## 📞 Support

- **Email:** api@sponsorgap.com
- **Documentation:** [API Docs](./API_DOCUMENTATION.md)
- **Issues:** [GitHub Issues](../../issues)

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Enterprise API access required.** Contact sales@sponsorgap.com for enterprise plans.