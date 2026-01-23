# SponsorGap Enterprise API Documentation

## Overview

The SponsorGap Enterprise API provides real-time and historical access to sponsor data for enterprise users. The API is available at `https://api.sponsorgap.com` and requires enterprise-level authentication.

## Authentication

All API endpoints (except service info) require an API key provided in the request header:

```
X-API-Key: your_enterprise_api_key_here
```

**Rate Limits:**
- 1,000 requests per hour
- 5 concurrent connections for streaming

## Base URL

```
https://api.sponsorgap.com
```

## Features

### Deduplication

By default, the API returns all sponsor records, which means the same company may appear multiple times if they sponsored different newsletters or the same newsletter on different dates. To get only unique companies (removing duplicates), add the `deduplicate=true` query parameter to any supported endpoint:

```bash
# Without deduplication (default) - May return same company multiple times
GET /v1/historical?limit=10

# With deduplication - Returns only unique companies
GET /v1/historical?limit=10&deduplicate=true
```

**How it works:**
- When `deduplicate=true`, the API groups sponsors by company name
- Returns only the most recent entry for each unique company
- Total count reflects unique companies, not total records
- Available on: `/v1/historical`, `/v1/industries/:industry/sponsors`, `/v1/brands/search`, `/v1/sponsors/trending`

### Contact Information

All sponsor records now include contact information fields:
- `contact_email` - Contact email for sponsorship inquiries
- `linkedin` - LinkedIn profile URL for primary contact

## Endpoints

### Service Information

#### Get API Info
```http
GET /
```

Returns basic API service information and available endpoints.

**Response:**
```json
{
  "success": true,
  "service": "SponsorGap Enterprise API",
  "version": "1.0.0",
  "endpoints": {
    "stats": "GET /v1/stats - API usage statistics and limits",
    "historical": "GET /v1/historical - Historical sponsor data with filtering",
    "stream": "GET /v1/stream - Real-time sponsor data stream"
  },
  "authentication": "API Key required in X-API-Key header"
}
```

#### Health Check
```http
GET /health
```

Returns API server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-06T20:00:00.000Z",
  "uptime": 3600,
  "mongodb": "connected"
}
```

### Statistics

#### Get Usage Statistics
```http
GET /v1/stats?timeframe={timeframe}
```

Returns API usage statistics and sponsor data insights.

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `timeframe` | string | `24h` | Time period: `1h`, `24h`, `7d` |

**Response:**
```json
{
  "success": true,
  "data": {
    "sponsor_stats": {
      "new_sponsors": 30,
      "total_sponsors": 18946,
      "top_categories": [
        {"_id": "Technology", "count": 4063},
        {"_id": "Software", "count": 2893}
      ],
      "timeframe": "24h"
    },
    "usage_stats": [],
    "user_limits": {
      "rate_limit": 1000,
      "connection_limit": 5,
      "current_connections": 0
    }
  },
  "meta": {
    "timestamp": "2025-12-06T20:00:00.000Z"
  }
}
```

### Historical Data

#### Get Historical Sponsors
```http
GET /v1/historical?{parameters}
```

Retrieve historical sponsor data with filtering and pagination.

**Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | `100` | Max results per page (1-1000) |
| `offset` | integer | `0` | Pagination offset |
| `since` | string | `24h ago` | Start date (ISO 8601 format) |
| `category` | string | - | Filter by sponsor category |
| `industry` | string | - | Filter by industry field |
| `audience_min` | integer | - | Minimum audience size |
| `audience_max` | integer | - | Maximum audience size |
| `deduplicate` | boolean | `false` | Remove duplicates, return unique companies only |

**Example Request:**
```bash
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/historical?category=Technology&limit=5&audience_min=10000"
```

**Response:**
```json
{
  "success": true,
  "data": [
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
      "description": "Leading software company...",
      "contact_email": "partnerships@techcorp.com",
      "linkedin": "https://linkedin.com/in/jane-doe",
      "created": "2025-12-06T19:00:00.000Z",
      "last_seen": "2025-12-06T20:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1250,
    "limit": 5,
    "offset": 0,
    "hasNext": true
  },
  "deduplicated": false,
  "meta": {
    "requestId": "req_123456789",
    "timestamp": "2025-12-06T20:00:00.000Z",
    "processing_time": "45ms"
  }
}
```

### Real-time Stream

#### Connect to Sponsor Stream
```http
GET /v1/stream?{parameters}
```

Establish a real-time Server-Sent Events connection for sponsor updates.

**Parameters:**
Same filtering parameters as historical endpoint.

**Example Request:**
```bash
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/stream?category=Technology"
```

**Response Format (Server-Sent Events):**
```
data: {"id":"msg_001","timestamp":"2025-12-06T20:00:00.000Z","type":"connection","data":{"status":"connected","filters":{"category":"Technology"}}}

data: {"id":"msg_002","timestamp":"2025-12-06T20:00:30.000Z","type":"heartbeat","data":{"active_connections":1}}

data: {"id":"msg_003","timestamp":"2025-12-06T20:01:00.000Z","type":"sponsor_update","data":{"action":"created","sponsor":{...}}}
```

**Event Types:**
- `connection` - Stream connection established
- `heartbeat` - Periodic keep-alive (every 30 seconds)
- `sponsor_update` - New sponsor data (actions: created, updated, deleted)

## Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "data": object|array,
  "error": string,           // Only on error
  "message": string,         // Only on error  
  "pagination": object,      // Only for paginated responses
  "meta": object            // Request metadata
}
```

## Error Responses

### Authentication Errors
```json
{
  "success": false,
  "error": "API key required",
  "message": "Please provide an API key in the X-API-Key header"
}
```

### Rate Limit Errors
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Hourly rate limit (1000) exceeded"
}
```

### Validation Errors
```json
{
  "success": false,
  "error": "Invalid parameter",
  "message": "limit must be between 1 and 1000"
}
```

## Sample Code

### JavaScript/Node.js
```javascript
const API_KEY = 'your_enterprise_api_key';
const BASE_URL = 'https://api.sponsorgap.com';

// Get historical data
async function getSponsors() {
  const response = await fetch(`${BASE_URL}/v1/historical?limit=10`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  const data = await response.json();
  return data.data;
}

// Connect to real-time stream
function connectStream() {
  const eventSource = new EventSource(`${BASE_URL}/v1/stream`, {
    headers: {
      'X-API-Key': API_KEY
    }
  });
  
  eventSource.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received:', data);
  };
}
```

### Python
```python
import requests
import json

API_KEY = 'your_enterprise_api_key'
BASE_URL = 'https://api.sponsorgap.com'

def get_sponsors(limit=10, category=None):
    headers = {'X-API-Key': API_KEY}
    params = {'limit': limit}
    if category:
        params['category'] = category
    
    response = requests.get(f'{BASE_URL}/v1/historical', 
                          headers=headers, params=params)
    return response.json()

# Get stats
def get_stats():
    headers = {'X-API-Key': API_KEY}
    response = requests.get(f'{BASE_URL}/v1/stats', headers=headers)
    return response.json()
```

### cURL Examples
```bash
# Get API info
curl https://api.sponsorgap.com/

# Get usage statistics  
curl -H "X-API-Key: your_key" https://api.sponsorgap.com/v1/stats

# Get recent technology sponsors
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/historical?category=Technology&limit=5"

# Connect to real-time stream with filters
curl -H "X-API-Key: your_key" \
  "https://api.sponsorgap.com/v1/stream?audience_min=10000"
```

## Support

- **Documentation**: https://docs.sponsorgap.com/api
- **Support Email**: api@sponsorgap.com
- **Status Page**: https://status.sponsorgap.com

## Rate Limits & Fair Usage

- **Rate Limit**: 1,000 requests per hour per API key
- **Concurrent Streams**: Maximum 5 simultaneous connections
- **Data Retention**: Historical data available for last 30 days
- **Request Timeout**: 30 seconds for HTTP requests
- **Stream Timeout**: 10 minutes of inactivity will close stream connections

---

**Note**: This API is available exclusively to Enterprise plan subscribers. Contact sales@sponsorgap.com for enterprise access.