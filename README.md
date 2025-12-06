# SponsorGap Enterprise API

Real-time sponsor data API for enterprise users.

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

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API service information |
| `/health` | GET | Health check |
| `/v1/stats` | GET | Usage statistics and sponsor insights |
| `/v1/historical` | GET | Historical sponsor data with filtering |
| `/v1/stream` | GET | Real-time sponsor updates (SSE) |

## 🔥 Quick Start

### Get Recent Sponsors
```bash
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/historical?limit=10&category=Technology"
```

### Connect to Real-time Stream
```bash
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/stream?audience_min=10000"
```

### Usage Statistics
```bash
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/stats"
```

## 📋 Rate Limits

- **HTTP Requests:** 1,000 per hour
- **Concurrent Streams:** 5 connections
- **Enterprise Only:** Requires enterprise plan subscription

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

## 🏗️ Architecture

- **Framework:** Express.js with MongoDB
- **Authentication:** API Key validation
- **Real-time:** Server-Sent Events (SSE)
- **Deployment:** Heroku with MongoDB Atlas
- **Documentation:** OpenAPI 3.0 + Scalar

## 📞 Support

- **Email:** api@sponsorgap.com
- **Documentation:** [API Docs](./API_DOCUMENTATION.md)
- **Issues:** [GitHub Issues](../../issues)

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Enterprise API access required.** Contact sales@sponsorgap.com for enterprise plans.