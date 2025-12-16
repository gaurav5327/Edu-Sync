#!/usr/bin/env node

/**
 * Enhanced PDF Export Test Script
 * Tests the new advanced PDF export features
 */

import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'http://localhost:5000/api/export'

// Test configurations for different export scenarios
const testConfigurations = [
  {
    name: "Default Professional Export",
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
    name: "Dark Theme with QR Code",
    config: {
      type: "timetables", 
      format: "pdf",
      filters: { program: "FYUP", year: 2, branch: "Mathematics", division: "B" },
      options: {
        theme: "dark",
        layout: "landscape",
        includeQR: true,
        includeStats: true,
        watermark: "CONFIDENTIAL"
      }
    }
  },
  {
    name: "Modern Theme with Logo",
    config: {
      type: "timetables",
      format: "pdf", 
      filters: { program: "B.Ed.", year: 1, branch: "Education", division: "A" },
      options: {
        theme: "modern",
        layout: "landscape",
        includeLogo: true,
        includeStats: true,
        customColors: {
          primary: "#8b5cf6",
          accent: "#06d6a0"
        }
      }
    }
  },
  {
    name: "Compact Layout",
    config: {
      type: "timetables",
      format: "pdf",
      filters: { program: "FYUP", year: 3, branch: "Physics", division: "A" },
      options: {
        theme: "default",
        layout: "compact",
        includeStats: false,
        selectedDays: ["Monday", "Wednesday", "Friday"]
      }
    }
  }
]

async function testExportFeature(testConfig) {
  console.log(`\n🧪 Testing: ${testConfig.name}`)
  console.log(`   Theme: ${testConfig.config.options.theme}`)
  console.log(`   Layout: ${testConfig.config.options.layout}`)
  
  try {
    const response = await fetch(`${BASE_URL}/export/${testConfig.config.type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testConfig.config)
    })

    if (response.ok) {
      const filename = `test_${testConfig.name.replace(/\s+/g, '_').toLowerCase()}.pdf`
      const buffer = await response.buffer()
      
      // Save test file
      fs.writeFileSync(path.join(process.cwd(), filename), buffer)
      
      console.log(`   ✅ Success: ${filename} (${(buffer.length / 1024).toFixed(1)}KB)`)
      
      // Check response headers
      const exportType = response.headers.get('X-Export-Type')
      const exportVersion = response.headers.get('X-Export-Version')
      if (exportType && exportVersion) {
        console.log(`   📋 Export Type: ${exportType}, Version: ${exportVersion}`)
      }
      
      return { success: true, size: buffer.length, filename }
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

async function testThemesEndpoint() {
  console.log('\n🎨 Testing Themes Endpoint...')
  
  try {
    const response = await fetch(`${BASE_URL}/themes`)
    if (response.ok) {
      const themes = await response.json()
      console.log(`   ✅ Available themes: ${Object.keys(themes).join(', ')}`)
      
      Object.entries(themes).forEach(([key, theme]) => {
        console.log(`   🎨 ${key}: ${theme.name} - ${theme.description}`)
      })
      
      return { success: true, themes }
    } else {
      console.log(`   ❌ Failed: ${response.status}`)
      return { success: false }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function testPreviewEndpoint() {
  console.log('\n👁️ Testing Preview Endpoint...')
  
  const previewConfig = {
    filters: { program: "FYUP", year: 1 },
    options: {
      theme: "modern",
      includeQR: true,
      includeStats: true,
      watermark: "PREVIEW"
    }
  }
  
  try {
    const response = await fetch(`${BASE_URL}/preview/timetables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(previewConfig)
    })
    
    if (response.ok) {
      const preview = await response.json()
      console.log(`   ✅ Preview generated:`)
      console.log(`   📄 Estimated pages: ${preview.estimatedPages}`)
      console.log(`   💾 Estimated size: ${preview.estimatedSize}`)
      console.log(`   🎨 Theme: ${preview.theme}`)
      console.log(`   📐 Layout: ${preview.layout}`)
      console.log(`   🔧 Features: ${Object.entries(preview.features).filter(([k,v]) => v).map(([k]) => k).join(', ')}`)
      
      return { success: true, preview }
    } else {
      console.log(`   ❌ Failed: ${response.status}`)
      return { success: false }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function testBatchExport() {
  console.log('\n📦 Testing Batch Export...')
  
  const batchConfig = {
    format: 'pdf',
    exports: [
      {
        type: 'timetables',
        filters: { program: 'FYUP', year: 1 },
        options: { theme: 'default' },
        customFilename: 'fyup_year1_timetables'
      },
      {
        type: 'timetables', 
        filters: { program: 'B.Ed.', year: 1 },
        options: { theme: 'modern', includeQR: true },
        customFilename: 'bed_year1_timetables'
      }
    ]
  }
  
  try {
    const response = await fetch(`${BASE_URL}/batch-export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchConfig)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log(`   ✅ Batch export prepared:`)
      console.log(`   🆔 Batch ID: ${result.batchId}`)
      console.log(`   📊 Total exports: ${result.totalExports}`)
      console.log(`   ✅ Success: ${result.successCount}`)
      console.log(`   ❌ Errors: ${result.errorCount}`)
      
      result.results.forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.filename} - ${r.status} (${r.recordCount || 0} records)`)
      })
      
      return { success: true, result }
    } else {
      console.log(`   ❌ Failed: ${response.status}`)
      return { success: false }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function testAnalytics() {
  console.log('\n📈 Testing Analytics Endpoint...')
  
  try {
    const response = await fetch(`${BASE_URL}/analytics?timeRange=7d`)
    
    if (response.ok) {
      const analytics = await response.json()
      console.log(`   ✅ Analytics retrieved:`)
      console.log(`   📊 Total exports: ${analytics.totalExports}`)
      console.log(`   📄 Popular formats: ${Object.entries(analytics.popularFormats).map(([k,v]) => `${k}(${v}%)`).join(', ')}`)
      console.log(`   📋 Popular types: ${Object.entries(analytics.popularTypes).map(([k,v]) => `${k}(${v}%)`).join(', ')}`)
      console.log(`   ⏰ Peak hours: ${analytics.peakHours.join(', ')}`)
      console.log(`   💾 Average file size: ${analytics.averageFileSize}`)
      
      return { success: true, analytics }
    } else {
      console.log(`   ❌ Failed: ${response.status}`)
      return { success: false }
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runAllTests() {
  console.log('🚀 Enhanced PDF Export Test Suite')
  console.log('=====================================')
  
  const results = {
    themes: await testThemesEndpoint(),
    preview: await testPreviewEndpoint(),
    batchExport: await testBatchExport(),
    analytics: await testAnalytics(),
    exports: []
  }
  
  // Test different export configurations
  for (const testConfig of testConfigurations) {
    const result = await testExportFeature(testConfig)
    results.exports.push({ config: testConfig, result })
  }
  
  // Summary
  console.log('\n📋 Test Summary')
  console.log('================')
  
  const successfulExports = results.exports.filter(e => e.result.success).length
  const totalExports = results.exports.length
  
  console.log(`✅ Successful exports: ${successfulExports}/${totalExports}`)
  console.log(`🎨 Themes endpoint: ${results.themes.success ? '✅' : '❌'}`)
  console.log(`👁️ Preview endpoint: ${results.preview.success ? '✅' : '❌'}`)
  console.log(`📦 Batch export: ${results.batchExport.success ? '✅' : '❌'}`)
  console.log(`📈 Analytics: ${results.analytics.success ? '✅' : '❌'}`)
  
  if (successfulExports > 0) {
    const totalSize = results.exports
      .filter(e => e.result.success)
      .reduce((sum, e) => sum + e.result.size, 0)
    
    console.log(`💾 Total generated: ${(totalSize / 1024).toFixed(1)}KB`)
    console.log(`📁 Files created: ${results.exports.filter(e => e.result.success).map(e => e.result.filename).join(', ')}`)
  }
  
  console.log('\n🎉 Enhanced PDF export testing complete!')
  
  return results
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error)
}

export { runAllTests, testExportFeature, testThemesEndpoint }