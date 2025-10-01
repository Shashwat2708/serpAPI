const axios = require('axios');

const BASE_URL = 'http://localhost:3002';

async function testAPI() {
    console.log('🧪 Testing SERP API Server...\n');

    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/health`);
        console.log('✅ Health check:', healthResponse.data);
        console.log('');

        // Test search endpoint
        console.log('2. Testing search endpoint...');
        const searchResponse = await axios.get(`${BASE_URL}/search?keyword=artificial%20intelligence`);
        console.log('✅ Search results:');
        console.log(`   Keyword: ${searchResponse.data.keyword}`);
        console.log(`   Total Results: ${searchResponse.data.totalResults}`);
        console.log(`   Search Time: ${searchResponse.data.searchInformation.timeTaken}s`);
        console.log('');

        // Display first few results
        console.log('3. Sample results:');
        searchResponse.data.results.slice(0, 3).forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.title}`);
            console.log(`      Link: ${result.link}`);
            console.log(`      Snippet: ${result.snippet.substring(0, 100)}...`);
            console.log('');
        });

        console.log('🎉 All tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

testAPI();
