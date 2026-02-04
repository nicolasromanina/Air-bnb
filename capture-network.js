const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('🚀 Starting network capture...');
  
  let browser;
  const requests = [];
  const responses = [];
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Capture all requests
    page.on('request', (req) => {
      requests.push({
        url: req.url(),
        method: req.method(),
        resourceType: req.resourceType(),
        timestamp: new Date().toISOString()
      });
      console.log(`📤 REQUEST: ${req.method()} ${req.url()}`);
    });
    
    // Capture all responses
    page.on('response', (res) => {
      responses.push({
        url: res.url(),
        status: res.status(),
        statusText: res.statusText(),
        headers: Object.fromEntries(res.headers()),
        resourceType: res.request().resourceType(),
        timestamp: new Date().toISOString()
      });
      console.log(`📥 RESPONSE: ${res.status()} ${res.url()}`);
    });
    
    // Set a longer timeout
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
    
    console.log('\n🌐 Navigating to http://localhost:4173/...');
    await page.goto('http://localhost:4173/', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait a bit more for any delayed requests
    console.log('⏳ Waiting for additional requests...');
    await page.waitForTimeout(3000);
    
    // Try to trigger the health check by clicking on the page or waiting for it
    console.log('🔍 Looking for health check endpoint...');
    await page.waitForTimeout(2000);
    
    await browser.close();
    
    // Save results
    const results = {
      timestamp: new Date().toISOString(),
      previewUrl: 'http://localhost:4173/',
      requestCount: requests.length,
      responseCount: responses.length,
      requests,
      responses,
      healthCheckRequest: requests.find(r => r.url.includes('/health')),
      healthCheckResponse: responses.find(r => r.url.includes('/health')),
      // Show all requests that mention api, health, or wmsignaturegroup
      apiRequests: requests.filter(r => r.url.includes('api') || r.url.includes('health') || r.url.includes('wmsignaturegroup')),
      apiResponses: responses.filter(r => r.url.includes('api') || r.url.includes('health') || r.url.includes('wmsignaturegroup'))
    };
    
    const outputPath = path.join(__dirname, 'network-capture.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('\n✅ Network capture complete!');
    console.log(`📊 Results saved to: ${outputPath}`);
    console.log(`\n📈 Summary:`);
    console.log(`   Total requests: ${results.requestCount}`);
    console.log(`   Total responses: ${results.responseCount}`);
    console.log(`\n🎯 Health Check Endpoint:`);
    if (results.healthCheckRequest) {
      console.log(`   Request URL: ${results.healthCheckRequest.url}`);
      console.log(`   Status: ${results.healthCheckResponse?.status || 'pending'}`);
    } else {
      console.log(`   No health check request found`);
    }
    console.log(`\n📡 API-related requests (${results.apiRequests.length}):`);
    results.apiRequests.forEach(r => {
      const resp = results.apiResponses.find(rr => rr.url === r.url);
      console.log(`   ${r.method} ${r.url} -> ${resp?.status || '?'}`);
    });
    
  } catch (error) {
    console.error('❌ Error during capture:', error.message);
    console.error(error);
    process.exit(1);
  }
})();
