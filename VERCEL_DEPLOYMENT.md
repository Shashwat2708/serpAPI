# Vercel Deployment Guide

This guide will help you deploy the SERP API Server to Vercel.

## Prerequisites

1. Vercel account (free tier available)
2. Vercel CLI installed: `npm i -g vercel`

## Deployment Steps

### Method 1: Using Vercel CLI (Recommended)

1. **Navigate to the project directory:**
   ```bash
   cd serp-api-server
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy the project:**
   ```bash
   vercel
   ```
   - Follow the prompts to configure your project
   - Choose your team/account
   - Set project name (e.g., `serp-api-server`)
   - Confirm settings

4. **Set environment variables:**
   ```bash
   vercel env add SERP_API_KEY
   ```
   - Enter your SERP API key: 
   - Choose "Production" environment

5. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. **Connect GitHub repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `serp-api-server` folder

2. **Configure build settings:**
   - Framework Preset: Other
   - Build Command: `npm install`
   - Output Directory: Leave empty
   - Install Command: `npm install`

3. **Set environment variables:**
   - Go to Project Settings → Environment Variables
   - Add `SERP_API_KEY` with value: `5ffba6b04f03fa606c5fc0cce8a4b0a98ecbe52ebdcda361ef5c45aa213f5237`
   - Add `NODE_ENV` with value `production`

4. **Deploy:**
   - Click "Deploy"

## Environment Variables

Set these in your Vercel project settings:

| Variable | Value | Description |
|----------|-------|-------------|
| `SERP_API_KEY` | `5ffba6b04f03fa606c5fc0cce8a4b0a98ecbe52ebdcda361ef5c45aa213f5237` | Required for API calls |
| `NODE_ENV` | `production` | Environment setting |

## API Endpoints

Once deployed, your API will be available at:
- `https://your-project-name.vercel.app/health`
- `https://your-project-name.vercel.app/search?keyword=your_keyword`

## Usage in Flutter

Update your Flutter app to use the Vercel URL:

```dart
final response = await http.get(
  Uri.parse('https://your-project-name.vercel.app/search?keyword=${Uri.encodeComponent(keyword)}')
);
```

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure your Flutter app's domain is added to the CORS origins in `server.js`

2. **Environment Variables:**
   - Make sure `SERP_API_KEY` is set in Vercel dashboard
   - Redeploy after adding environment variables

3. **Function Timeout:**
   - Vercel has a 10-second timeout for hobby plans
   - Consider upgrading if you need longer processing times

### Checking Logs:

```bash
vercel logs
```

## Local Development

To test locally with production-like environment:

```bash
# Set environment variable
export SERP_API_KEY=your_api_key_here
export NODE_ENV=production

# Start server
npm start
```

## Monitoring

- Check function invocations in Vercel dashboard
- Monitor response times and errors
- Set up alerts for high error rates

## Security Notes

- Never commit API keys to version control
- Use environment variables for sensitive data
- Consider rate limiting for production use
- Monitor API usage to avoid exceeding SERP API limits
