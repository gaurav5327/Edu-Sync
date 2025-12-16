import express from "express"
import PDFDocument from "pdfkit"
import XLSX from "xlsx"
import Schedule from "../models/Schedule.js"
import User from "../models/User.js"
import Course from "../models/Course.js"
import Room from "../models/Room.js"
import FieldWork from "../models/FieldWork.js"
import TeachingPractice from "../models/TeachingPractice.js"

const router = express.Router()

// Enhanced Professional Timetable PDF with advanced features
const generateTimetablePDF = (data, res, filename, options = {}) => {
  const {
    layout = 'landscape',
    theme = 'default',
    includeLogo = false,
    includeQR = false,
    includeStats = true,
    includeConflicts = true,
    customColors = {},
    dateRange = null,
    selectedDays = null,
    watermark = null
  } = options

  const doc = new PDFDocument({ 
    margin: 30, 
    layout: layout,
    info: {
      Title: 'Professional Timetable',
      Author: 'Dynamic Scheduler',
      Subject: 'Academic Timetable Export',
      Keywords: 'timetable, schedule, academic, export'
    }
  })
  
  // Set response headers with enhanced metadata
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`)
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('X-Export-Type', 'timetable')
  res.setHeader('X-Export-Version', '2.0')
  
  // Pipe the PDF to response
  doc.pipe(res)
  
  // Enhanced constants with customization support
  const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
  const DAYS = selectedDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const LUNCH_BREAK_SLOT = '12:00'
  
  // Theme colors with customization
  const themes = {
    default: {
      primary: '#4f46e5',
      secondary: '#f1f5f9',
      accent: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      lab: '#dbeafe',
      theory: '#ffffff',
      lunch: '#fef3c7'
    },
    dark: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#0ea5e9',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      lab: '#0f172a',
      theory: '#1e293b',
      lunch: '#451a03'
    },
    modern: {
      primary: '#6366f1',
      secondary: '#f8fafc',
      accent: '#8b5cf6',
      success: '#06d6a0',
      warning: '#ffd166',
      danger: '#f72585',
      lab: '#e0e7ff',
      theory: '#ffffff',
      lunch: '#fef3c7'
    }
  }
  
  const currentTheme = { ...themes[theme], ...customColors }
  
  // Utility functions for enhanced PDF generation
  const addWatermark = (doc, text) => {
    if (!text) return
    doc.save()
    doc.rotate(45, { origin: [doc.page.width / 2, doc.page.height / 2] })
    doc.fontSize(60).fillColor('#f3f4f6', 0.1)
    doc.text(text, 0, doc.page.height / 2 - 30, { 
      align: 'center', 
      width: doc.page.width 
    })
    doc.restore()
  }
  
  const detectConflicts = (schedule) => {
    const conflicts = []
    const timeSlotMap = new Map()
    
    schedule.timetable?.forEach((slot, index) => {
      const key = `${slot.day}-${slot.startTime}`
      if (timeSlotMap.has(key)) {
        conflicts.push({
          slot1: timeSlotMap.get(key),
          slot2: { ...slot, index },
          type: 'time_conflict'
        })
      } else {
        timeSlotMap.set(key, { ...slot, index })
      }
      
      // Check for instructor conflicts
      if (slot.course?.instructor) {
        const instructorKey = `${slot.course.instructor._id}-${slot.day}-${slot.startTime}`
        // Additional conflict detection logic can be added here
      }
    })
    
    return conflicts
  }
  
  if (Array.isArray(data) && data.length > 0) {
    data.forEach((schedule, scheduleIndex) => {
      if (scheduleIndex > 0) {
        doc.addPage()
      }
      
      // Add watermark if specified
      if (watermark) {
        addWatermark(doc, watermark)
      }
      
      // Compact header to save space
      const headerHeight = includeLogo ? 60 : 45
      doc.rect(30, 30, doc.page.width - 60, headerHeight).fill(currentTheme.primary)
      
      // Logo placeholder (if enabled, smaller)
      if (includeLogo) {
        doc.rect(40, 35, 30, 30).fill('white')
        doc.fontSize(6).fillColor(currentTheme.primary).text('LOGO', 50, 48, { align: 'center', width: 10 })
      }
      
      // Compact title
      const titleX = includeLogo ? 80 : 50
      doc.fontSize(16).fillColor('white').text('TIMETABLE', titleX, 35, { align: 'center' })
      doc.fontSize(10).fillColor('white').text(
        `${schedule.program || 'Program'} • Year ${schedule.year || 'N/A'} • ${schedule.branch || 'Branch'} • Div ${schedule.division || 'N/A'}`,
        titleX, 50, { align: 'center' }
      )
      
      // Compact generation info
      const generationY = 30 + headerHeight + 5
      doc.fontSize(6).fillColor('#6b7280')
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 50, generationY, { align: 'left' })
      doc.text(`ID: ${Date.now().toString(36).toUpperCase()}`, doc.page.width - 100, generationY, { align: 'right' })
      
      // Compact conflict warning
      const conflicts = includeConflicts ? detectConflicts(schedule) : []
      if (conflicts.length > 0) {
        doc.fontSize(7).fillColor(currentTheme.danger)
        doc.text(`⚠️ ${conflicts.length} conflict(s)`, 50, generationY + 10)
      }
      
      if (schedule.timetable && schedule.timetable.length > 0) {
        // Create timetable grid structure
        const timetableGrid = {}
        DAYS.forEach(day => {
          timetableGrid[day] = {}
          TIME_SLOTS.forEach(time => {
            timetableGrid[day][time] = null
          })
        })
        
        // Fill the grid with actual data
        schedule.timetable.forEach(slot => {
          if (timetableGrid[slot.day] && timetableGrid[slot.day].hasOwnProperty(slot.startTime)) {
            timetableGrid[slot.day][slot.startTime] = slot
          }
        })
        
        // Optimized table dimensions to fit on single page
        const startX = 30
        const startY = conflicts.length > 0 ? 150 : 130
        const timeColumnWidth = 70
        const availableWidth = doc.page.width - 60 - timeColumnWidth
        const dayColumnWidth = availableWidth / DAYS.length
        
        // Calculate optimal cell height to fit everything on one page
        const availableHeight = doc.page.height - startY - 120 // Reserve space for legend/stats
        const totalRows = TIME_SLOTS.length + 1 // +1 for header
        const maxCellHeight = Math.floor(availableHeight / totalRows)
        const cellHeight = Math.min(maxCellHeight, layout === 'compact' ? 40 : 50)
        
        // Add compact QR code if enabled
        if (includeQR) {
          const qrSize = 30
          doc.rect(doc.page.width - qrSize - 35, 35, qrSize, qrSize).stroke()
          doc.fontSize(4).fillColor('#6b7280').text('QR', doc.page.width - qrSize - 35, 70, { width: qrSize, align: 'center' })
        }
        
        // Enhanced table with modern styling
        const tableWidth = timeColumnWidth + (dayColumnWidth * DAYS.length)
        const tableHeight = cellHeight * (TIME_SLOTS.length + 1)
        
        // Table shadow effect
        doc.rect(startX + 2, startY + 2, tableWidth, tableHeight).fill('#00000010')
        
        // Main table border
        doc.rect(startX, startY, tableWidth, tableHeight)
          .fill('white')
          .stroke(currentTheme.secondary)
        
        // Enhanced header row with gradient effect
        doc.rect(startX, startY, tableWidth, cellHeight)
          .fill(currentTheme.primary)
          .stroke(currentTheme.secondary)
        
        // Time header with proper centering
        doc.rect(startX, startY, timeColumnWidth, cellHeight)
          .fill(currentTheme.primary)
          .stroke(currentTheme.secondary)
        
        const headerFontSize = Math.min(10, cellHeight / 4)
        const timeHeaderY = startY + (cellHeight / 2) - (headerFontSize / 2)
        doc.fontSize(headerFontSize).fillColor('white')
        doc.text('TIME', startX + 5, timeHeaderY, { 
          width: timeColumnWidth - 10, 
          align: 'center',
          lineBreak: false
        })
        
        // Day headers with proper sizing and centering
        DAYS.forEach((day, dayIndex) => {
          const x = startX + timeColumnWidth + (dayColumnWidth * dayIndex)
          doc.rect(x, startY, dayColumnWidth, cellHeight)
            .fill(currentTheme.primary)
            .stroke(currentTheme.secondary)
          
          const dayHeaderY = startY + (cellHeight / 2) - (headerFontSize / 2)
          doc.fontSize(headerFontSize).fillColor('white')
          
          // Truncate day name if cell is too narrow
          let dayText = day.toUpperCase()
          if (dayColumnWidth < 80) {
            dayText = day.substring(0, 3).toUpperCase() // MON, TUE, etc.
          }
          
          doc.text(dayText, x + 3, dayHeaderY, { 
            width: dayColumnWidth - 6, 
            align: 'center',
            lineBreak: false
          })
        })
        
        // Draw time slots and classes
        TIME_SLOTS.forEach((timeSlot, timeIndex) => {
          const y = startY + cellHeight * (timeIndex + 1)
          
          // Time column with proper centering
          doc.rect(startX, y, timeColumnWidth, cellHeight).fill('#ffffff').stroke('#e5e7eb')
          doc.fontSize(9).fillColor('#111827')
          const timeY = y + (cellHeight / 2) - 4 // Center vertically
          doc.text(timeSlot, startX + 5, timeY, { 
            width: timeColumnWidth - 10, align: 'center' 
          })
          
          // Day columns
          DAYS.forEach((day, dayIndex) => {
            const x = startX + timeColumnWidth + (dayColumnWidth * dayIndex)
            
            // Compact lunch break styling
            if (timeSlot === LUNCH_BREAK_SLOT) {
              doc.rect(x, y, dayColumnWidth, cellHeight)
                .fill(currentTheme.lunch)
                .stroke(currentTheme.warning)
              
              // Properly centered lunch break text
              const lunchCenterY = y + (cellHeight / 2)
              doc.fontSize(7).fillColor('#92400e')
              doc.text('LUNCH', x + 3, lunchCenterY - 8, { width: dayColumnWidth - 6, align: 'center' })
              doc.text('BREAK', x + 3, lunchCenterY, { width: dayColumnWidth - 6, align: 'center' })
              doc.fontSize(5).fillColor('#a16207')
              doc.text('12:00-13:00', x + 3, lunchCenterY + 8, { width: dayColumnWidth - 6, align: 'center' })
              return
            }
            
            const slot = timetableGrid[day][timeSlot]
            
            if (slot && !slot.isFree) {
              // Enhanced class scheduling with conflict detection
              const isLab = slot.course?.lectureType === 'lab'
              const isTheory = slot.course?.lectureType === 'theory'
              const hasConflict = conflicts.some(c => 
                (c.slot1.index === slot.index) || (c.slot2.index === slot.index)
              )
              
              // Enhanced background with conflict highlighting
              let bgColor = isLab ? currentTheme.lab : currentTheme.theory
              let borderColor = '#e5e7eb'
              
              if (hasConflict) {
                bgColor = '#fef2f2'
                borderColor = currentTheme.danger
              }
              
              doc.rect(x, y, dayColumnWidth, cellHeight)
                .fill(bgColor)
                .stroke(borderColor)
              
              // Conflict warning indicator
              if (hasConflict) {
                doc.fontSize(8).fillColor(currentTheme.danger)
                doc.text('⚠️', x + dayColumnWidth - 15, y + 3)
              }
              
              const courseName = slot.course?.name || 'Unnamed Course'
              const courseCode = slot.course?.code || 'No Code'
              const instructor = slot.course?.instructor?.name || 'No Instructor'
              const room = slot.room?.name || 'No Room'
              const duration = slot.course?.duration || 60
              
              // Properly sized and positioned course information
              const padding = 3
              const lineHeight = Math.max(8, cellHeight / 6) // Dynamic line height based on cell size
              
              // Calculate appropriate font sizes based on cell dimensions
              const titleFontSize = Math.min(8, Math.max(6, cellHeight / 8))
              const detailFontSize = Math.min(6, Math.max(4, cellHeight / 10))
              
              // Calculate text truncation based on actual cell width
              const maxNameLength = Math.floor((dayColumnWidth - padding * 2) / 4) // Approximate chars per width
              const maxInstructorLength = Math.floor((dayColumnWidth - padding * 2) / 5)
              
              const truncatedName = courseName.length > maxNameLength ? 
                courseName.substring(0, Math.max(5, maxNameLength - 3)) + '...' : courseName
              const truncatedInstructor = instructor.length > maxInstructorLength ? 
                instructor.substring(0, Math.max(5, maxInstructorLength - 3)) + '...' : instructor
              
              // Course name
              doc.fontSize(titleFontSize).fillColor('#111827')
              doc.text(truncatedName, x + padding, y + padding, { 
                width: dayColumnWidth - (padding * 2), 
                align: 'left',
                lineBreak: false
              })
              
              // Course code
              doc.fontSize(detailFontSize).fillColor('#6b7280')
              doc.text(courseCode, x + padding, y + padding + lineHeight, { 
                width: dayColumnWidth - (padding * 2), 
                align: 'left',
                lineBreak: false
              })
              
              // Instructor
              doc.fontSize(detailFontSize).fillColor('#374151')
              doc.text(truncatedInstructor, x + padding, y + padding + (lineHeight * 2), { 
                width: dayColumnWidth - (padding * 2), 
                align: 'left',
                lineBreak: false
              })
              
              // Room
              doc.fontSize(detailFontSize).fillColor('#6b7280')
              doc.text(room, x + padding, y + padding + (lineHeight * 3), { 
                width: dayColumnWidth - (padding * 2), 
                align: 'left',
                lineBreak: false
              })
              
              // Properly positioned lecture type badges
              const badgeHeight = Math.min(8, cellHeight / 6)
              const badgeY = y + cellHeight - badgeHeight - 2
              const badgeFontSize = Math.max(3, badgeHeight - 2)
              
              if (isLab) {
                const badgeWidth = Math.min(25, dayColumnWidth / 3)
                doc.rect(x + padding, badgeY, badgeWidth, badgeHeight)
                  .fill(currentTheme.accent)
                  .stroke()
                doc.fontSize(badgeFontSize).fillColor('white')
                doc.text('LAB', x + padding, badgeY + 1, { 
                  width: badgeWidth, 
                  align: 'center',
                  lineBreak: false
                })
                
                // Lab session indicator (if space allows)
                if (dayColumnWidth > 60 && (slot.isLabFirst || slot.isLabSecond)) {
                  const indicatorX = x + padding + badgeWidth + 2
                  doc.fontSize(Math.max(2, badgeFontSize - 1)).fillColor(currentTheme.accent)
                  const sessionText = slot.isLabFirst ? '1st' : '2nd'
                  doc.text(sessionText, indicatorX, badgeY + 2, { lineBreak: false })
                }
              } else if (isTheory) {
                const badgeWidth = Math.min(35, dayColumnWidth / 2.5)
                doc.rect(x + padding, badgeY, badgeWidth, badgeHeight)
                  .fill(currentTheme.success)
                  .stroke()
                doc.fontSize(badgeFontSize).fillColor('white')
                doc.text('THEORY', x + padding, badgeY + 1, { 
                  width: badgeWidth, 
                  align: 'center',
                  lineBreak: false
                })
              }
              
            } else if (slot && slot.isFree) {
              // Free period with proper centering
              doc.rect(x, y, dayColumnWidth, cellHeight).fill('#ffffff').stroke('#e5e7eb')
              const freePeriodY = y + (cellHeight / 2) - 4
              doc.fontSize(Math.min(7, cellHeight / 6)).fillColor('#9ca3af')
              doc.text('Free Period', x + 3, freePeriodY, { 
                width: dayColumnWidth - 6, 
                align: 'center',
                lineBreak: false
              })
            } else {
              // No class scheduled with proper centering
              doc.rect(x, y, dayColumnWidth, cellHeight).fill('#ffffff').stroke('#e5e7eb')
              const noClassY = y + (cellHeight / 2) - 4
              doc.fontSize(Math.min(6, cellHeight / 7)).fillColor('#d1d5db')
              doc.text('No class', x + 3, noClassY, { 
                width: dayColumnWidth - 6, 
                align: 'center',
                lineBreak: false
              })
            }
          })
        })
        
        // Compact legend to fit on single page
        const legendY = startY + cellHeight * (TIME_SLOTS.length + 1) + 10
        const remainingSpace = doc.page.height - legendY - 30
        
        if (remainingSpace > 40) {
          // Only show legend if there's enough space
          const legendWidth = doc.page.width - 60
          doc.rect(startX, legendY - 3, legendWidth, 25)
            .fill('#f8fafc')
            .stroke('#e2e8f0')
          
          doc.fontSize(8).fillColor('#1e293b').text('Legend:', startX + 10, legendY + 2)
          
          // Compact legend items in single row
          const legendItems = [
            { color: currentTheme.lab, border: currentTheme.accent, text: 'Lab', x: 60 },
            { color: currentTheme.theory, border: '#e5e7eb', text: 'Theory', x: 120 },
            { color: currentTheme.lunch, border: currentTheme.warning, text: 'Lunch', x: 180 },
            { color: '#fef2f2', border: currentTheme.danger, text: 'Conflict', x: 240 }
          ]
          
          legendItems.forEach(item => {
            if (startX + item.x + 60 < doc.page.width - 30) {
              doc.rect(startX + item.x, legendY + 10, 8, 6)
                .fill(item.color)
                .stroke(item.border)
              doc.fontSize(6).fillColor('#374151')
              doc.text(item.text, startX + item.x + 12, legendY + 12)
            }
          })
        }
        
        // Compact statistics to fit on single page
        if (includeStats && remainingSpace > 70) {
          const summaryY = legendY + (remainingSpace > 40 ? 30 : 15)
          const totalSlots = schedule.timetable?.filter(slot => !slot.isFree).length || 0
          const labSlots = schedule.timetable?.filter(slot => slot.course?.lectureType === 'lab').length || 0
          const theorySlots = schedule.timetable?.filter(slot => slot.course?.lectureType === 'theory').length || 0
          const uniqueCourses = [...new Set(schedule.timetable?.map(slot => slot.course?.name).filter(Boolean) || [])].length
          const uniqueInstructors = [...new Set(schedule.timetable?.map(slot => slot.course?.instructor?.name).filter(Boolean) || [])].length
          
          // Compact statistics in single line
          const statsText = `Classes: ${totalSlots} (${labSlots} Lab, ${theorySlots} Theory) • Courses: ${uniqueCourses} • Instructors: ${uniqueInstructors}`
          
          doc.fontSize(7).fillColor('#475569')
          doc.text(statsText, startX + 10, summaryY)
          
          // Utilization and conflicts in second line if space allows
          if (remainingSpace > 85) {
            const totalPossibleSlots = DAYS.length * (TIME_SLOTS.length - 1) // Excluding lunch
            const utilization = totalPossibleSlots > 0 ? ((totalSlots / totalPossibleSlots) * 100).toFixed(1) : 0
            
            let secondLineText = `Utilization: ${utilization}%`
            if (conflicts.length > 0) {
              secondLineText += ` • Conflicts: ${conflicts.length}`
            }
            
            doc.fontSize(7).fillColor('#059669')
            doc.text(secondLineText, startX + 10, summaryY + 12)
          }
        }
        
      } else {
        doc.fontSize(12).fillColor('#ef4444')
        doc.text('No timetable data available for this schedule', 50, 150, { align: 'center' })
      }
    })
  } else {
    doc.fontSize(14).fillColor('#ef4444')
    doc.text('No timetable data found', 50, 150, { align: 'center' })
  }
  
  doc.end()
}

// Helper function to generate Timetable Excel
const generateTimetableExcel = (data, res, filename) => {
  let worksheetData = []
  
  // Headers for timetable data
  worksheetData.push([
    'Schedule ID', 'Program', 'Year', 'Branch', 'Division', 
    'Day', 'Start Time', 'Course Name', 'Course Code', 
    'Instructor', 'Room', 'Duration', 'Lecture Type'
  ])
  
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(schedule => {
      if (schedule.timetable && schedule.timetable.length > 0) {
        schedule.timetable.forEach(slot => {
          worksheetData.push([
            schedule._id?.toString() || '',
            schedule.program || '',
            schedule.year || '',
            schedule.branch || '',
            schedule.division || '',
            slot.day || '',
            slot.startTime || '',
            slot.course?.name || '',
            slot.course?.code || '',
            slot.course?.instructor?.name || '',
            slot.room?.name || '',
            slot.course?.duration || '',
            slot.course?.lectureType || ''
          ])
        })
      } else {
        worksheetData.push([
          schedule._id?.toString() || '',
          schedule.program || '',
          schedule.year || '',
          schedule.branch || '',
          schedule.division || '',
          'No timetable data',
          '', '', '', '', '', '', ''
        ])
      }
    })
  }
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Timetables')
  
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`)
  res.send(buffer)
}

// Helper function to generate Timetable CSV
const generateTimetableCSV = (data, res, filename) => {
  let csvContent = 'Schedule ID,Program,Year,Branch,Division,Day,Start Time,Course Name,Course Code,Instructor,Room,Duration,Lecture Type\n'
  
  if (Array.isArray(data) && data.length > 0) {
    data.forEach(schedule => {
      if (schedule.timetable && schedule.timetable.length > 0) {
        schedule.timetable.forEach(slot => {
          const row = [
            schedule._id?.toString() || '',
            schedule.program || '',
            schedule.year || '',
            schedule.branch || '',
            schedule.division || '',
            slot.day || '',
            slot.startTime || '',
            slot.course?.name || '',
            slot.course?.code || '',
            slot.course?.instructor?.name || '',
            slot.room?.name || '',
            slot.course?.duration || '',
            slot.course?.lectureType || ''
          ].map(field => `"${field.toString().replace(/"/g, '""')}"`)
          
          csvContent += row.join(',') + '\n'
        })
      } else {
        const row = [
          schedule._id?.toString() || '',
          schedule.program || '',
          schedule.year || '',
          schedule.branch || '',
          schedule.division || '',
          'No timetable data',
          '', '', '', '', '', '', ''
        ].map(field => `"${field.toString().replace(/"/g, '""')}"`)
        
        csvContent += row.join(',') + '\n'
      }
    })
  }
  
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`)
  res.send(csvContent)
}

// Helper function to generate PDF
const generatePDF = (data, type, res, filename) => {
  const doc = new PDFDocument({ margin: 50 })
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`)
  
  // Pipe the PDF to response
  doc.pipe(res)
  
  // Add title
  doc.fontSize(20).text(`${type.toUpperCase().replace('-', ' ')} Export Report`, 50, 50)
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, 50, 80)
  doc.text(`Total Records: ${Array.isArray(data) ? data.length : 1}`, 50, 100)
  
  let yPosition = 140
  
  if (Array.isArray(data) && data.length > 0) {
    // Create table headers
    const headers = Object.keys(data[0]).filter(key => !key.startsWith('_') && key !== '__v')
    const columnWidth = (doc.page.width - 100) / headers.length
    
    // Draw headers
    doc.fontSize(10).fillColor('black')
    headers.forEach((header, index) => {
      doc.text(header.toUpperCase(), 50 + (index * columnWidth), yPosition, {
        width: columnWidth - 5,
        align: 'left'
      })
    })
    
    yPosition += 20
    doc.moveTo(50, yPosition).lineTo(doc.page.width - 50, yPosition).stroke()
    yPosition += 10
    
    // Add data rows
    data.forEach((item, rowIndex) => {
      if (yPosition > doc.page.height - 100) {
        doc.addPage()
        yPosition = 50
        
        // Redraw headers on new page
        headers.forEach((header, index) => {
          doc.text(header.toUpperCase(), 50 + (index * columnWidth), yPosition, {
            width: columnWidth - 5,
            align: 'left'
          })
        })
        yPosition += 20
        doc.moveTo(50, yPosition).lineTo(doc.page.width - 50, yPosition).stroke()
        yPosition += 10
      }
      
      headers.forEach((header, colIndex) => {
        let value = item[header]
        if (typeof value === 'object' && value !== null) {
          if (value.name) value = value.name
          else if (value._id) value = value._id.toString().slice(-6)
          else value = JSON.stringify(value)
        }
        
        doc.fontSize(8).text(
          (value || '').toString().substring(0, 50), 
          50 + (colIndex * columnWidth), 
          yPosition,
          {
            width: columnWidth - 5,
            align: 'left'
          }
        )
      })
      
      yPosition += 15
      
      // Add separator line every 5 rows
      if ((rowIndex + 1) % 5 === 0) {
        doc.moveTo(50, yPosition).lineTo(doc.page.width - 50, yPosition).stroke()
        yPosition += 5
      }
    })
  } else if (typeof data === 'object') {
    // Handle analytics or single object data
    Object.entries(data).forEach(([key, value]) => {
      if (yPosition > doc.page.height - 100) {
        doc.addPage()
        yPosition = 50
      }
      
      doc.fontSize(12).text(`${key}:`, 50, yPosition)
      doc.fontSize(10).text(
        typeof value === 'object' ? JSON.stringify(value, null, 2) : value.toString(),
        150, yPosition
      )
      yPosition += 25
    })
  }
  
  doc.end()
}

// Helper function to generate Excel
const generateExcel = (data, type, res, filename) => {
  let worksheetData = []
  
  if (Array.isArray(data) && data.length > 0) {
    // Convert Mongoose documents to plain objects and filter relevant fields
    const cleanData = data.map(item => {
      const obj = item.toObject ? item.toObject() : item
      const filtered = {}
      
      // Only include relevant fields, exclude Mongoose internals
      Object.keys(obj).forEach(key => {
        if (!key.startsWith('_') && key !== '__v' && key !== '$__' && key !== '$isNew' && key !== '_doc') {
          filtered[key] = obj[key]
        } else if (key === '_id') {
          filtered.id = obj[key].toString()
        }
      })
      
      return filtered
    })
    
    if (cleanData.length > 0) {
      const headers = Object.keys(cleanData[0])
      worksheetData.push(headers)
      
      cleanData.forEach(item => {
        const row = headers.map(header => {
          let value = item[header]
          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              return value.join('; ')
            } else if (value.name) {
              return value.name
            } else if (value._id) {
              return value._id.toString()
            } else {
              return JSON.stringify(value)
            }
          }
          return value || ''
        })
        worksheetData.push(row)
      })
    }
  } else if (typeof data === 'object') {
    // Handle single object or analytics data
    worksheetData.push(['Key', 'Value'])
    Object.entries(data).forEach(([key, value]) => {
      worksheetData.push([key, typeof value === 'object' ? JSON.stringify(value) : value])
    })
  }
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, type.replace('-', '_'))
  
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`)
  res.send(buffer)
}

// Helper function to generate CSV
const generateCSV = (data, type, res, filename) => {
  let csvContent = ''
  
  if (Array.isArray(data) && data.length > 0) {
    // Convert Mongoose documents to plain objects and filter relevant fields
    const cleanData = data.map(item => {
      const obj = item.toObject ? item.toObject() : item
      const filtered = {}
      
      // Only include relevant fields, exclude Mongoose internals
      Object.keys(obj).forEach(key => {
        if (!key.startsWith('_') && key !== '__v' && key !== '$__' && key !== '$isNew' && key !== '_doc') {
          filtered[key] = obj[key]
        } else if (key === '_id') {
          filtered.id = obj[key].toString()
        }
      })
      
      return filtered
    })
    
    if (cleanData.length > 0) {
      const headers = Object.keys(cleanData[0])
      csvContent = headers.join(',') + '\n'
      
      cleanData.forEach(item => {
        const row = headers.map(header => {
          let value = item[header]
          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              value = value.join('; ')
            } else if (value.name) {
              value = value.name
            } else if (value._id) {
              value = value._id.toString()
            } else {
              value = JSON.stringify(value)
            }
          }
          return `"${(value || '').toString().replace(/"/g, '""')}"`
        })
        csvContent += row.join(',') + '\n'
      })
    }
  } else if (typeof data === 'object') {
    csvContent = 'Key,Value\n'
    Object.entries(data).forEach(([key, value]) => {
      const val = typeof value === 'object' ? JSON.stringify(value) : value
      csvContent += `"${key}","${val}"\n`
    })
  }
  
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`)
  res.send(csvContent)
}

// Advanced export endpoints with enhanced features

// Get available export themes
router.get("/themes", (req, res) => {
  const themes = {
    default: {
      name: "Default Blue",
      description: "Professional blue theme with clean design",
      preview: "#4f46e5"
    },
    dark: {
      name: "Dark Mode",
      description: "Modern dark theme for reduced eye strain",
      preview: "#1e293b"
    },
    modern: {
      name: "Modern Purple",
      description: "Contemporary purple theme with vibrant colors",
      preview: "#6366f1"
    }
  }
  res.json(themes)
})

// Preview export options
router.post("/preview/:type", async (req, res) => {
  try {
    const { type } = req.params
    const { filters, options } = req.body

    // Generate preview metadata without creating full PDF
    const previewData = {
      estimatedPages: 1,
      estimatedSize: "~150KB",
      features: {
        conflicts: options?.includeConflicts !== false,
        statistics: options?.includeStats !== false,
        qrCode: options?.includeQR || false,
        watermark: !!options?.watermark,
        customTheme: options?.theme !== 'default'
      },
      theme: options?.theme || 'default',
      layout: options?.layout || 'landscape'
    }

    res.json(previewData)
  } catch (error) {
    console.error("Preview error:", error)
    res.status(500).json({ message: "Preview failed", error: error.message })
  }
})

// Export endpoints
router.post("/export/:type", async (req, res) => {
  try {
    const { type } = req.params
    const { format, filters, options } = req.body

    console.log(`Export request: ${type} in ${format} format`)
    console.log("Filters:", filters)
    console.log("Options:", options)

    let data = []
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    let filename = `${type}_export_${timestamp}`

    switch (type) {
      case "timetables":
        const query = {}
        if (filters.program) query.program = filters.program
        if (filters.year) query.year = Number.parseInt(filters.year)
        if (filters.branch) query.branch = filters.branch
        if (filters.division) query.division = filters.division

        data = await Schedule.find(query)
          .populate({
            path: "timetable.course",
            populate: { path: "instructor", select: "name" },
          })
          .populate("timetable.room")
          .sort({ createdAt: -1 })
        break

      case "students":
        const studentQuery = { role: "student" }
        if (filters.program) studentQuery.program = filters.program
        if (filters.year) studentQuery.year = Number.parseInt(filters.year)
        if (filters.branch) studentQuery.department = filters.branch
        if (filters.division) studentQuery.division = filters.division

        data = await User.find(studentQuery).select("-password")
        break

      case "courses":
        const courseQuery = {}
        if (filters.year) courseQuery.year = Number.parseInt(filters.year)
        if (filters.branch) courseQuery.branch = filters.branch
        if (filters.division) courseQuery.division = filters.division

        data = await Course.find(courseQuery).populate("instructor", "name")
        break

      case "faculty":
        data = await User.find({ role: "teacher" }).select("-password")
        break

      case "teaching-practices":
        data = await TeachingPractice.find()
          .populate("student", "name program year")
          .populate("supervisor", "name")
        break

      case "field-works":
        data = await FieldWork.find()
          .populate("student", "name program year")
          .populate("supervisor", "name")
        break

      case "analytics":
        // Generate analytics report
        const totalSchedules = await Schedule.countDocuments()
        const totalStudents = await User.countDocuments({ role: "student" })
        const totalTeachers = await User.countDocuments({ role: "teacher" })
        const totalCourses = await Course.countDocuments()
        const totalRooms = await Room.countDocuments()

        data = {
          summary: {
            totalSchedules,
            totalStudents,
            totalTeachers,
            totalCourses,
            totalRooms,
          },
          generatedAt: new Date(),
        }
        break

      default:
        return res.status(400).json({ message: "Invalid export type" })
    }

    // Handle different formats
    try {
      switch (format) {
        case "json":
          res.json(data)
          break
        
        case "csv":
          if (type === "timetables") {
            generateTimetableCSV(data, res, filename)
          } else {
            generateCSV(data, type, res, filename)
          }
          break
        
        case "pdf":
          if (type === "timetables") {
            // Enhanced PDF options from request body
            const pdfOptions = {
              layout: options?.layout || 'landscape',
              theme: options?.theme || 'default',
              includeLogo: options?.includeLogo || false,
              includeQR: options?.includeQR || false,
              includeStats: options?.includeStats !== false, // Default true
              includeConflicts: options?.includeConflicts !== false, // Default true
              customColors: options?.customColors || {},
              dateRange: options?.dateRange || null,
              selectedDays: options?.selectedDays || null,
              watermark: options?.watermark || null
            }
            generateTimetablePDF(data, res, filename, pdfOptions)
          } else {
            generatePDF(data, type, res, filename)
          }
          break
        
        case "excel":
          if (type === "timetables") {
            generateTimetableExcel(data, res, filename)
          } else {
            generateExcel(data, type, res, filename)
          }
          break
        
        default:
          res.json(data)
          break
      }
    } catch (formatError) {
      console.error("Format generation error:", formatError)
      res.status(500).json({ 
        message: `Failed to generate ${format} export`, 
        error: formatError.message 
      })
    }
  } catch (error) {
    console.error("Export error:", error)
    res.status(500).json({ message: "Export failed", error: error.message })
  }
})

// Batch export endpoint for multiple schedules with different options
router.post("/batch-export", async (req, res) => {
  try {
    const { exports, format = 'pdf' } = req.body
    
    if (!Array.isArray(exports) || exports.length === 0) {
      return res.status(400).json({ message: "No export configurations provided" })
    }

    const results = []
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')

    for (const exportConfig of exports) {
      const { type, filters, options, customFilename } = exportConfig
      
      try {
        // Fetch data based on type and filters
        let data = []
        const query = {}
        if (filters?.program) query.program = filters.program
        if (filters?.year) query.year = Number.parseInt(filters.year)
        if (filters?.branch) query.branch = filters.branch
        if (filters?.division) query.division = filters.division

        if (type === "timetables") {
          data = await Schedule.find(query)
            .populate({
              path: "timetable.course",
              populate: { path: "instructor", select: "name" },
            })
            .populate("timetable.room")
            .sort({ createdAt: -1 })
        }

        const filename = customFilename || `${type}_${timestamp}`
        
        results.push({
          type,
          filename: `${filename}.${format}`,
          status: 'ready',
          recordCount: Array.isArray(data) ? data.length : 1,
          options: options || {}
        })
      } catch (error) {
        results.push({
          type,
          filename: `${type}_${timestamp}.${format}`,
          status: 'error',
          error: error.message
        })
      }
    }

    res.json({
      batchId: `batch_${timestamp}`,
      results,
      totalExports: exports.length,
      successCount: results.filter(r => r.status === 'ready').length,
      errorCount: results.filter(r => r.status === 'error').length
    })
  } catch (error) {
    console.error("Batch export error:", error)
    res.status(500).json({ message: "Batch export failed", error: error.message })
  }
})

// Export analytics endpoint
router.get("/analytics", async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query
    
    // Mock analytics data - in real implementation, track export usage
    const analytics = {
      totalExports: Math.floor(Math.random() * 1000) + 500,
      popularFormats: {
        pdf: 65,
        excel: 25,
        csv: 10
      },
      popularTypes: {
        timetables: 70,
        students: 15,
        courses: 10,
        faculty: 5
      },
      recentActivity: [
        { date: new Date().toISOString(), type: 'timetables', format: 'pdf', count: 5 },
        { date: new Date(Date.now() - 86400000).toISOString(), type: 'students', format: 'excel', count: 2 }
      ],
      peakHours: [9, 10, 14, 15, 16], // Hours when exports are most common
      averageFileSize: "145KB",
      timeRange
    }

    res.json(analytics)
  } catch (error) {
    console.error("Analytics error:", error)
    res.status(500).json({ message: "Analytics failed", error: error.message })
  }
})

// Bulk import endpoint
router.post("/bulk-import", async (req, res) => {
  try {
    const { type, options } = req.body
    const file = req.file

    console.log(`Bulk import request: ${type}`)
    console.log("Options:", options)
    console.log("File:", file ? file.originalname : "No file")

    // Mock import results for now
    const mockResults = {
      processed: Math.floor(Math.random() * 100) + 50,
      created: Math.floor(Math.random() * 80) + 30,
      updated: Math.floor(Math.random() * 20) + 5,
      errors: [
        { index: 5, error: "Invalid email format" },
        { index: 12, error: "Missing required field: name" },
      ],
    }

    // In a real implementation, you would:
    // 1. Parse the uploaded file (CSV, Excel, JSON)
    // 2. Validate the data
    // 3. Insert/update records in the database
    // 4. Return actual results

    res.json(mockResults)
  } catch (error) {
    console.error("Bulk import error:", error)
    res.status(500).json({ message: "Import failed", error: error.message })
  }
})

// Template download endpoints
router.get("/templates/:type", async (req, res) => {
  try {
    const { type } = req.params

    let template = ""
    let filename = `${type}_template.csv`

    switch (type) {
      case "students":
        template = "name,email,rollNo,year,branch,division,program,enrolledCredits\n"
        template += "John Doe,john@example.com,STU001,1,Computer Science,A,FYUP,20\n"
        template += "Jane Smith,jane@example.com,STU002,2,Mathematics,B,B.Ed.,18"
        break

      case "courses":
        template = "name,code,instructorId,duration,capacity,year,branch,division,lectureType,credits,program\n"
        template += "Data Structures,CS101,instructor_id_here,60,50,1,Computer Science,A,theory,4,FYUP\n"
        template += "Database Systems,CS201,instructor_id_here,90,30,2,Computer Science,A,lab,3,FYUP"
        break

      case "faculty":
        template = "name,email,department,teachableYears,expertise\n"
        template += "Dr. Smith,smith@example.com,Computer Science,\"1,2,3\",\"Programming,Algorithms\"\n"
        template += "Prof. Johnson,johnson@example.com,Mathematics,\"1,2\",\"Statistics,Calculus\""
        break

      case "rooms":
        template = "name,capacity,type,department,allowedYears,isAvailable\n"
        template += "Room 101,50,classroom,Computer Science,\"1,2,3,4\",true\n"
        template += "Lab A,30,lab,Computer Science,\"2,3,4\",true"
        break

      default:
        return res.status(400).json({ message: "Invalid template type" })
    }

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`)
    res.send(template)
  } catch (error) {
    console.error("Template download error:", error)
    res.status(500).json({ message: "Template download failed", error: error.message })
  }
})

export default router