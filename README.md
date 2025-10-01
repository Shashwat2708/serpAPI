# SERP API Server

A Node.js API server that acts as a proxy for SERP API calls to avoid CORS issues when called from Flutter web applications.

## Features

- ✅ CORS-enabled for Flutter web apps
- ✅ SERP API integration for Google search results
- ✅ Returns top 12 search results
- ✅ Error handling and validation
- ✅ Health check endpoint
- ✅ Formatted response structure

## Setup

1. Install dependencies:
```bash
cd serp-api-server
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Search
```
GET /search?keyword=your_search_term
```

**Parameters:**
- `keyword` (required): The search term to query

**Response:**
```json
{
  "success": true,
  "keyword": "your_search_term",
  "totalResults": 12,
  "results": [
    {
      "position": 1,
      "title": "Result Title",
      "link": "https://example.com",
      "snippet": "Result description...",
      "displayLink": "example.com",
      "date": "2024-01-01"
    }
  ],
  "searchInformation": {
    "totalResults": "1,000,000",
    "timeTaken": "0.23"
  }
}
```

## Usage in Flutter

Replace your direct SERP API calls with:

```dart
final response = await http.get(
  Uri.parse('http://localhost:3002/search?keyword=${Uri.encodeComponent(keyword)}')
);
```

## Configuration

The API key must be set as an environment variable `SERP_API_KEY`. No API keys are stored in the code for security.

**For Vercel deployment:**
- Set `SERP_API_KEY` in Vercel dashboard
- Value: 

**For local development:**
```bash
export SERP_API_KEY=
npm start
```

## Vercel Deployment

This server is configured for Vercel deployment. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd serp-api-server
vercel

# Set environment variables
vercel env add SERP_API_KEY
```

## CORS Configuration

The server is configured to allow requests from:
- `http://localhost:3000` (local development)
- `https://ovedo-web.web.app` (Firebase hosting)
- `https://ovedo-web.firebaseapp.com` (Firebase hosting)

## Error Handling

The API includes comprehensive error handling for:
- Missing parameters
- SERP API errors
- Network issues
- Internal server errors
