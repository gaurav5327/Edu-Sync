#!/usr/bin/env node

/**
 * API Endpoints Test Script
 * Tests all the new API endpoints that MultiProgramDashboard needs
 */

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api'

// Test endpoints that MultiProgramDashboard is trying to access
const testEndpoints = [
  {
    name: "Courses API",
    url: `${BASE_URL}/courses?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Timetables API", 
    url: `${BASE_URL}/timetables?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Analytics Enrollment API",
    url: `${BASE_URL}/analytics/enrollment?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Students API",
    url: `${BASE_URL}/students?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Analytics Dashboard",
    url: `${BASE_URL}/analytics/dashboard?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Course Statistics",
    url: `${BASE_URL}/courses/stats/overview?program=FYUP`,
    method: 'GET'
  },
  {
    name: "Timetable Statistics",
    url: `${BASE_URL}/timetables/stats/overview?program=FYUP`,
    method: 'GET'
  }
]

async function testEndpoint(endpoint) {
  console.log(`\n🧪 Testing: ${endpoint.name}`)
  console.log(`   URL: ${endpoint.url}`)
  
  try {
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ Status: ${response.status} ${response.statusText}`)
      console.log(`   📊 Response: ${typeof data === 'object' ? JSON.stringify(data).substring(0, 100) + '...' : data}`)
      
      return { success: true, status: response.status, data }
    } else {
      const error = await response.text()
      console.log(`   ❌ Status: ${response.status} ${response.statusText}`)
      console.log(`   📝 Error: ${error.substring(0, 200)}`)
      
      return { success: false, status: response.status, error }
    }
  } catch (error) {
    console.log(`   ❌ Network Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function testServerHealth() {
  console.log('🏥 Testing Server Health...')
  
  try {
    const response = await fetch(`${BASE_URL}/health`)
    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ Server is healthy: ${data.message}`)
      return true
    } else {
      console.log(`   ❌ Server health check failed: ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`   ❌ Cannot reach server: ${error.message}`)
    return false
  }
}

async function runAPITests() {
  console.log('🚀 API Endpoints Test Suite')
  console.log('============================')
  console.log('Testing all endpoints that MultiProgramDashboard needs...\n')
  
  // First check if server is running
  const serverHealthy = await testServerHealth()
  
  if (!serverHealthy) {
    console.log('\n❌ Server is not running or not healthy!')
    console.log('💡 Make sure to start the server with: npm start or node server.js')
    return
  }
  
  const results = []
  
  // Test all endpoints
  for (const endpoint of testEndpoints) {
    const result = await testEndpoint(endpoint)
    results.push({ endpoint, result })
  }
  
  // Summary
  console.log('\n📋 API Test Summary')
  console.log('===================')
  
  const successfulTests = results.filter(r => r.result.success).length
  const totalTests = results.length
  
  console.log(`✅ Successful tests: ${successfulTests}/${totalTests}`)
  
  const failedTests = results.filter(r => !r.result.success)
  if (failedTests.length > 0) {
    console.log(`\n❌ Failed endpoints:`)
    failedTests.forEach(test => {
      console.log(`   - ${test.endpoint.name}: ${test.result.status || 'Network Error'}`)
    })
  }
  
  console.log('\n💡 Next Steps:')
  if (successfulTests === totalTests) {
    console.log('   🎉 All endpoints are working! MultiProgramDashboard should work correctly.')
  } else {
    console.log('   🔧 Some endpoints are failing. Check server logs for details.')
    console.log('   📝 Make sure MongoDB is connected and models are properly set up.')
  }
  
  console.log('\n🔗 Frontend Configuration:')
  console.log(`   API_URL should be: ${BASE_URL}`)
  console.log('   Server should be running on: http://localhost:3000')
  
  return results
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAPITests().catch(console.error)
}

export { runAPITests, testEndpoint }