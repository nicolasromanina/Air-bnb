import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  console.log('🚀 Starting network capture...\n');
  
  let browser;
  const requests = [];
  const responses = [];
  
  try {
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      timeout: 60000
    });
    
    const page = await browser.newPage();
    
    // Capture all requests
    page.on('request', (req) => {
      requests.push({
        url: req.url(),
        method: req.method(),
        resourceType: req.resourceType()
      });
      if (req.url().includes('api') || req.url().includes('health') || req.url().includes('localhost')) {
        console.log(`📤 ${req.method()} ${req.url()}`);
      }
    });
    
    // Capture all responses
    page.on('response', (res) => {
      responses.push({
        url: res.url(),
        status: res.status(),
        statusText: res.statusText(),
        resourceType: res.request().resourceType()
      });
      if (res.url().includes('api') || res.url().includes('health') || res.url().includes('localhost')) {
        console.log(`📥 ${res.status()} ${res.url()}`);
      }
    });
    
    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);
    
    console.log('📍 Navigating to http://localhost:4173/\n');
    try {
      await page.goto('http://localhost:4173/', { 
        waitUntil: 'networkidle0',
        timeout: 60000
      });
    } catch (e) {
      console.log('⚠️  Navigation timeout (expected on Windows), continuing with capture...');
    }
    
    console.log('⏳ Waiting for additional requests (5 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await browser.close();
    
    // Save results
    const results = {
      timestamp: new Date().toISOString(),
      previewUrl: 'http://localhost:4173/',
      requestCount: requests.length,
      responseCount: responses.length,
      requests,
      responses,
      // Find health check requests
      healthCheckRequest: requests.find(r => r.url.includes('/health')),
      healthCheckResponse: responses.find(r => r.url.includes('/health')),
      // Show all requests that mention api, health, or wmsignaturegroup
      apiRequests: requests.filter(r => r.url.includes('api') || r.url.includes('health') || r.url.includes('wmsignaturegroup')),
      apiResponses: responses.filter(r => r.url.includes('api') || r.url.includes('health') || r.url.includes('wmsignaturegroup'))
    };
    
    const outputPath = path.join(__dirname, 'network-capture.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('\n✅ Network capture complete!');
    console.log(`📊 Results saved to: ${outputPath}\n`);
    console.log(`📈 SUMMARY:`);
    console.log(`   Total requests: ${results.requestCount}`);
    console.log(`   Total responses: ${results.responseCount}`);
    console.log(`\n🎯 HEALTH CHECK ENDPOINT:`);
    if (results.healthCheckRequest) {
      console.log(`   Request: ${results.healthCheckRequest.url}`);
      if (results.healthCheckResponse) {
        console.log(`   Response Status: ${results.healthCheckResponse.status} ${results.healthCheckResponse.statusText}`);
      }
    } else {
      console.log(`   ❌ No health check request captured`);
    }
    
    console.log(`\n📡 API-RELATED REQUESTS (${results.apiRequests.length}):`);
    if (results.apiRequests.length === 0) {
      console.log('   (none)');
    } else {
      results.apiRequests.forEach(r => {
        const resp = results.apiResponses.find(rr => rr.url === r.url);
        console.log(`   ${r.method.padEnd(6)} ${r.url}`);
        if (resp) {
          console.log(`          ↳ Response: ${resp.status} ${resp.statusText}`);
        }
      });
    }
    
  } catch (error) {
    console.error('\n❌ Error during capture:', error.message);
    if (error.code !== 'ECONNREFUSED') {
      console.error(error.stack);
    } else {
      console.error('   Make sure the preview server is running: npm run preview');
    }
    process.exit(1);
  }
})();
