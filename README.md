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

### 🏠 Service & Health
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/` | GET | API service information and endpoint list | ✅ Live |
| `/health` | GET | Server health and MongoDB connection status | ✅ Live |

### 📈 Core Data Access
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/stats` | GET | API usage statistics and sponsor data insights | ✅ Live |
| `/v1/historical` | GET | Historical sponsor data with advanced filtering | ✅ Live |
| `/v1/stream` | GET | Real-time sponsor updates via Server-Sent Events | ✅ Live |

### 🏭 Industry & Category Discovery
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/industries` | GET | List all available industries with sponsor counts | ✅ Live |
| `/v1/industries/{industry}/sponsors` | GET | Get sponsors by specific industry with filtering (supports deduplication) | ✅ Live |
| `/v1/categories` | GET | List all sponsor categories | 🔧 Planned |
| `/v1/categories/{category}/sponsors` | GET | Get sponsors by category | 🔧 Planned |
| `/v1/industries/{industry}/stats` | GET | Industry-specific statistics and trends | 🔧 Planned |

### 🏢 Brand & Company Intelligence
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/brands/search` | GET | Search brands by name with fuzzy matching (supports deduplication) | ✅ Live |
| `/v1/brands` | GET | Advanced brand search with multiple filters | 🔧 Planned |
| `/v1/brands/{brandId}` | GET | Get detailed brand information and history | 🔧 Planned |
| `/v1/brands/{brandId}/history` | GET | Brand's complete sponsorship history | 🔧 Planned |
| `/v1/brands/{brandId}/competitors` | GET | Find similar/competing brands | 🔧 Planned |
| `/v1/brands/trending` | GET | Most active brands in recent time period | 🔧 Planned |
| `/v1/brands/new` | GET | Recently discovered brand sponsors | 🔧 Planned |

### 🎯 Audience & Targeting
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/audience/ranges` | GET | Sponsor distribution by audience size ranges | ✅ Live |
| `/v1/sponsors/audience/{min}/{max}` | GET | Find sponsors by audience size range | 🔧 Planned |
| `/v1/audience/demographics` | GET | Detailed audience demographic data | 🔧 Planned |
| `/v1/targeting/recommendations` | GET | AI-powered targeting suggestions | 🔧 Planned |

### 📊 Analytics & Market Insights
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/analytics/market-overview` | GET | Comprehensive market analysis and trends | ✅ Live |
| `/v1/sponsors/trending` | GET | Trending sponsors (most active recently, supports deduplication) | ✅ Live |
| `/v1/analytics/industry/{industry}` | GET | Deep industry analysis and benchmarks | 🔧 Planned |
| `/v1/analytics/competition` | GET | Competitive landscape analysis | 🔧 Planned |
| `/v1/analytics/gaps` | GET | Market gap analysis and opportunities | 🔧 Planned |
| `/v1/insights/predictions` | GET | AI predictions for sponsor trends | 🔧 Planned |

### 💰 Pricing & Ad Spend Intelligence
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/spending/ranges` | GET | Ad spend categories and ranges | 🔧 Planned |
| `/v1/sponsors/spending/{min}/{max}` | GET | Find sponsors by ad spend range | 🔧 Planned |
| `/v1/pricing/trends` | GET | Sponsorship pricing trends over time | 🔧 Planned |
| `/v1/pricing/benchmarks` | GET | Industry pricing benchmarks | 🔧 Planned |

### 🔍 Advanced Search & Discovery
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/search/sponsors` | GET | Advanced multi-field sponsor search | 🔧 Planned |
| `/v1/search/newsletters` | GET | Search newsletters and publications | 🔧 Planned |
| `/v1/discover/opportunities` | GET | AI-powered opportunity discovery | 🔧 Planned |
| `/v1/similar/{sponsorId}` | GET | Find sponsors similar to a given sponsor | 🔧 Planned |

### 📅 Time-Based & Live Data
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/sponsors/recent` | GET | Recently active sponsors | 🔧 Planned |
| `/v1/campaigns/active` | GET | Currently running sponsorship campaigns | 🔧 Planned |
| `/v1/campaigns/upcoming` | GET | Upcoming campaign opportunities | 🔧 Planned |
| `/v1/historical/timeline` | GET | Sponsor activity timeline analysis | 🔧 Planned |
| `/v1/live/activity` | GET | Live sponsor activity feed | 🔧 Planned |
| `/v1/live/new-opportunities` | GET | Real-time new opportunities | 🔧 Planned |

### 📝 Publications & Content Analysis
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/publications` | GET | List of newsletters and publications | 🔧 Planned |
| `/v1/publications/{pubId}/sponsors` | GET | Sponsors of a specific publication | 🔧 Planned |
| `/v1/publications/metrics` | GET | Publication performance metrics | 🔧 Planned |
| `/v1/ad-placements/types` | GET | Types of ad placements available | 🔧 Planned |

### 🎯 Matching & Recommendations
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/match/brands-to-audience` | GET | Match brands to your target audience | 🔧 Planned |
| `/v1/recommendations/sponsors` | GET | Personalized sponsor recommendations | 🔧 Planned |
| `/v1/compatibility/{brandId}` | GET | Brand compatibility score analysis | 🔧 Planned |
| `/v1/outreach/suggestions` | GET | Outreach strategy suggestions | 🔧 Planned |

### 📋 Data Management & Export
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/export/csv` | GET | Export sponsor data as CSV | 🔧 Planned |
| `/v1/export/json` | GET | Export sponsor data as JSON | 🔧 Planned |
| `/v1/reports/generate` | POST | Generate custom reports | 🔧 Planned |

### 🔔 Alerts & Notifications
| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/v1/alerts/setup` | POST | Set up custom sponsor alerts | 🔧 Planned |
| `/v1/alerts/triggered` | GET | Recently triggered alerts | 🔧 Planned |
| `WebSocket /v1/ws/live-feed` | WS | WebSocket live sponsor updates | 🔧 Planned |

**Legend:**
- ✅ **Live:** Currently available and operational
- 🚧 **Pending Deployment:** Code ready, deployment in progress
- 🔧 **Planned:** Designed and ready for implementation

## 🎯 New Features

### Deduplication Support
By default, the API returns all sponsor records, which means the same company may appear multiple times if they sponsored different newsletters or the same newsletter on different dates. To get only unique companies (removing duplicates), add `?deduplicate=true`:

```bash
# Without deduplication (default) - May return same company multiple times
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/historical?limit=10"

# With deduplication - Returns only unique companies
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/historical?limit=10&deduplicate=true"
```

**Supported Endpoints:**
- `/v1/historical`
- `/v1/industries/:industry/sponsors`
- `/v1/brands/search`
- `/v1/sponsors/trending`

### Contact Information
All sponsor records now include contact fields for direct outreach:
- `contact_email` - Contact email for sponsorship inquiries
- `linkedin` - LinkedIn profile URL for primary contact

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

# Find technology sponsors (with deduplication for unique companies)
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/industries/Technology/sponsors?limit=20&deduplicate=true"

# Search for specific brands (deduplicated)
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/brands/search?q=Microsoft&limit=5&deduplicate=true"

# Get trending unique sponsors (last 7 days)
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/sponsors/trending?days=7&limit=15&deduplicate=true"
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
  "description": "Leading software company specializing in developer tools",
  "contact_email": "partnerships@techcorp.com",
  "linkedin": "https://linkedin.com/in/jane-doe",
  "created": "2025-12-06T19:00:00.000Z",
  "last_seen": "2025-12-06T20:00:00.000Z",
  "annual_revenue": 100000000,
  "annual_revenue_printed": "100M",
  "total_funding": 251200000,
  "total_funding_printed": "251.2M",
  "latest_funding_round_date": "2023-08-01T00:00:00.000Z",
  "latest_funding_stage": "Series D",
  "employee_count": 320,
  "founded_year": 2020,
  "market_cap": "1.9B"
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
- **💰 Financial Intelligence:** Company revenue, funding data, and market cap from Apollo API
- **📊 Market Analytics:** Comprehensive insights and trend analysis
- **🔥 Real-time Updates:** Live sponsor activity via Server-Sent Events
- **🎯 Smart Filtering:** Target sponsors by category, audience, and more
- **📈 Trending Data:** Discover the most active sponsors recently
- **🏭 Industry Insights:** Deep-dive into specific industry segments
- **🚫 Deduplication:** Remove duplicate entries to get unique companies only
- **📧 Contact Information:** Direct access to sponsor contact emails and LinkedIn profiles

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