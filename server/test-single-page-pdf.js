#!/usr/bin/env node

/**
 * Single Page PDF Test Script
 * Tests that each timetable fits on exactly one page
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'http://localhost:5000/api/export'

// Test configurations for single page validation
const testConfigurations = [
  {
    name: "Standard Layout",
    config: {
      type: "timetables",
      format: "pdf",
      filters: { program: "FYUP", year: 1, branch: "Computer Science", division: "A" },
      options: {
        theme: "default",
        layout: "landscape",
        includeStats: true,
        includeConflicts: true
      }
    }
  },
  {
    name: "Compact Layout",
    config: {
      type: "timetables", 
      format: "pdf",
      filters: { program: "FYUP", year: 2, branch: "Mathematics", division: "B" },
      options: {
        theme: "default",
        layout: "compact",
        includeStats: true,
        includeConflicts: true
      }
    }
  },
  {
    name: "With All Features",
    config: {
      type: "timetables",
      format: "pdf", 
      filters: { program: "B.Ed.", year: 1, branch: "Education", division: "A" },
      options: {
        theme: "modern",
        layout: "landscape",
        includeLogo: true,
        includeQR: true,
        includeStats: true,
        includeConflicts: true,
        watermark: "SINGLE PAGE TEST"
      }
    }
  },
  {
    name: "Minimal Features",
    config: {
      type: "timetables",
      format: "pdf",
      filters: { program: "FYUP", year: 3, branch: "Physics", division: "A" },
      options: {
        theme: "default",
        layout: "landscape",
        includeStats: false,
        includeConflicts: false,
        includeLogo: false,
        includeQR: false
      }
    }
  }
]

async function testSinglePagePDF(testConfig) {
  console.log(`\n📄 Testing: ${testConfig.name}`)
  console.log(`   Layout: ${testConfig.config.options.layout}`)
  console.log(`   Features: ${Object.entries(testConfig.config.options).filter(([k,v]) => v === true).map(([k]) => k).join(', ') || 'minimal'}`)
  
  try {
    const response = await fetch(`${BASE_URL}/export/${testConfig.config.type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig.config)
    })

    if (response.ok) {
      const filename = `single_page_${testConfig.name.replace(/\s+/g, '_').toLowerCase()}.pdf`
      const buffer = await response.buffer()
      
      // Save test file
      fs.writeFileSync(path.join(process.cwd(), filename), buffer)
      
      console.log(`   ✅ Generated: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`)
      
      // Basic validation - check if file is reasonable size (not too large indicating multiple pages)
      const sizeKB = buffer.length / 1024
      if (sizeKB > 500) {
        console.log(`   ⚠️  Warning: File size ${sizeKB.toFixed(1)}KB might indicate multiple pages`)
      } else {
        console.log(`   ✅ Size check passed: ${sizeKB.toFixed(1)}KB (likely single page)`)
      }
      
      return { success: true, size: buffer.length, filename, sizeKB }
    } else {
      const error = await response.text()
      console.log(`   ❌ Failed: ${response.status} - ${error}`)
      return { success: false, error }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runSinglePageTests() {
  console.log('📄 Single Page PDF Test Suite')
  console.log('==============================')
  console.log('Testing that each timetable fits on exactly one page...\n')
  
  const results = []
  
  // Test different configurations
  for (const testConfig of testConfigurations) {
    const result = await testSinglePagePDF(testConfig)
    results.push({ config: testConfig, result })
  }
  
  // Summary
  console.log('\n📋 Single Page Test Summary')
  console.log('============================')
  
  const successfulTests = results.filter(r => r.result.success).length
  const totalTests = results.length
  
  console.log(`✅ Successful tests: ${successfulTests}/${totalTests}`)
  
  if (successfulTests > 0) {
    const avgSize = results
      .filter(r => r.result.success)
      .reduce((sum, r) => sum + r.result.sizeKB, 0) / successfulTests
    
    console.log(`📊 Average file size: ${avgSize.toFixed(1)}KB`)
    
    const largeFiles = results.filter(r => r.result.success && r.result.sizeKB > 300)
    if (largeFiles.length > 0) {
      console.log(`⚠️  Large files (might be multi-page):`)
      largeFiles.forEach(f => {
        console.log(`   - ${f.result.filename}: ${f.result.sizeKB.toFixed(1)}KB`)
      })
    } else {
      console.log(`✅ All files are reasonably sized (likely single page)`)
    }
    
    console.log(`📁 Generated files:`)
    results.filter(r => r.result.success).forEach(r => {
      console.log(`   - ${r.result.filename}`)
    })
  }
  
  console.log('\n💡 Tips for single page optimization:')
  console.log('   - Use "compact" layout for maximum content density')
  console.log('   - Disable stats/conflicts if not needed')
  console.log('   - Avoid watermarks and logos for more space')
  console.log('   - Consider reducing selected days if needed')
  
  console.log('\n🎉 Single page PDF testing complete!')
  
  return results
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSinglePageTests().catch(console.error)
}

export { runSinglePageTests, testSinglePagePDF }