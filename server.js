const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('./config');

// Check if API key is configured
if (!config.SERP_API_KEY) {
    console.error('❌ SERP_API_KEY environment variable is not set!');
    console.error('Please set SERP_API_KEY in your Vercel environment variables.');
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
    origin: true, // Allow all origins for now
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'SERP API Server is running' });
});

// Search endpoint
app.get('/search', async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({
                error: 'Keyword parameter is required'
            });
        }

        // Call SERP API
        const serpApiUrl = 'https://serpapi.com/search.json';
        const params = {
            engine: 'google',
            q: keyword,
            api_key: config.SERP_API_KEY,
            num: 12 // Get top 12 results as requested
        };

        console.log(`Searching for: ${keyword}`);

        const response = await axios.get(serpApiUrl, { params });

        // Extract organic results
        const organicResults = response.data.organic_results || [];

        // Format the response to include only necessary data
        const formattedResults = organicResults.map((result, index) => ({
            position: index + 1,
            title: result.title || '',
            link: result.link || '',
            snippet: result.snippet || '',
            displayLink: result.display_link || '',
            date: result.date || null
        }));

        res.json({
            success: true,
            keyword: keyword,
            totalResults: formattedResults.length,
            results: formattedResults,
            searchInformation: {
                totalResults: response.data.search_information?.total_results || '0',
                timeTaken: response.data.search_information?.time_taken_displayed || '0'
            }
        });

    } catch (error) {
        console.error('SERP API Error:', error.message);

        if (error.response) {
            // SERP API returned an error
            res.status(error.response.status).json({
                success: false,
                error: 'SERP API Error',
                message: error.response.data?.error || 'Failed to fetch search results',
                details: error.response.data
            });
        } else if (error.request) {
            // Network error
            res.status(503).json({
                success: false,
                error: 'Network Error',
                message: 'Unable to reach SERP API service'
            });
        } else {
            // Other error
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: 'An unexpected error occurred'
            });
        }
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
});

// For Vercel deployment
if (process.env.NODE_ENV === 'production') {
    // Export the app for Vercel
    module.exports = app;
} else {
    // For local development
    const PORT = config.PORT;
    app.listen(PORT, () => {
        console.log(`🚀 SERP API Server running on port ${PORT}`);
        console.log(`📡 Health check: http://localhost:${PORT}/health`);
        console.log(`🔍 Search endpoint: http://localhost:${PORT}/search?keyword=your_keyword`);
    });
}
