const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'SerpAPI Proxy Server is running!',
        timestamp: new Date().toISOString()
    });
});

// SerpAPI search endpoint
app.get('/api/search', async (req, res) => {
    try {
        const { q, engine = 'google', num = 10, ...otherParams } = req.query;

        // Validate required parameters
        if (!q) {
            return res.status(400).json({
                error: 'Missing required parameter: q (search query)'
            });
        }

        if (!process.env.SERPAPI_KEY) {
            return res.status(500).json({
                error: 'SerpAPI key not configured on server'
            });
        }

        // Build SerpAPI request parameters
        const serpApiParams = {
            engine,
            q,
            api_key: process.env.SERPAPI_KEY,
            num: parseInt(num) || 10,
            ...otherParams
        };

        // Make request to SerpAPI
        const response = await axios.get('https://serpapi.com/search.json', {
            params: serpApiParams,
            timeout: 30000 // 30 second timeout
        });

        // Return the results
        res.json({
            success: true,
            data: response.data,
            query: q,
            engine,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('SerpAPI Error:', error.message);

        if (error.response) {
            // SerpAPI returned an error
            res.status(error.response.status).json({
                error: 'SerpAPI Error',
                message: error.response.data?.error || error.message,
                status: error.response.status
            });
        } else if (error.request) {
            // Network error
            res.status(503).json({
                error: 'Network Error',
                message: 'Failed to connect to SerpAPI'
            });
        } else {
            // Other error
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }
});

// Specific endpoint for video searches
app.get('/api/search/video', async (req, res) => {
    try {
        const { q, num = 10, ...otherParams } = req.query;

        if (!q) {
            return res.status(400).json({
                error: 'Missing required parameter: q (search query)'
            });
        }

        if (!process.env.SERPAPI_KEY) {
            return res.status(500).json({
                error: 'SerpAPI key not configured on server'
            });
        }

        const serpApiParams = {
            engine: 'google_videos',
            q,
            api_key: process.env.SERPAPI_KEY,
            num: parseInt(num) || 10,
            ...otherParams
        };

        const response = await axios.get('https://serpapi.com/search.json', {
            params: serpApiParams,
            timeout: 30000
        });

        res.json({
            success: true,
            data: response.data,
            query: q,
            engine: 'google_videos',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('SerpAPI Video Error:', error.message);

        if (error.response) {
            res.status(error.response.status).json({
                error: 'SerpAPI Error',
                message: error.response.data?.error || error.message,
                status: error.response.status
            });
        } else if (error.request) {
            res.status(503).json({
                error: 'Network Error',
                message: 'Failed to connect to SerpAPI'
            });
        } else {
            res.status(500).json({
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET / - Health check',
            'GET /api/search - General search',
            'GET /api/search/video - Video search'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 SerpAPI Proxy Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}`);
    console.log(`🔍 Search endpoint: http://localhost:${PORT}/api/search`);
    console.log(`🎥 Video search: http://localhost:${PORT}/api/search/video`);
});

module.exports = app;