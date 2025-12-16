"use client"

import { useState } from "react"
import axios from "axios"

const API_URL = "http://localhost:3000/api"

function ExportManager() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [exportConfig, setExportConfig] = useState({
    type: "timetables",
    format: "pdf",
    filters: {
      program: "",
      year: "",
      branch: "",
      division: "",
      semester: "",
    },
    options: {
      includeMetadata: true,
      includeStatistics: false,
      template: "standard",
      orientation: "landscape",
      colorScheme: "default",
    },
  })

  const [bulkImportConfig, setBulkImportConfig] = useState({
    type: "students",
    file: null,
    options: {
      upsert: false,
      validateOnly: false,
      skipErrors: true,
      batchSize: 100,
    },
  })

  const [importResults, setImportResults] = useState(null)

  const handleExport = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post(
        `${API_URL}/export/${exportConfig.type}`,
        {
          format: exportConfig.format,
          filters: exportConfig.filters,
          options: exportConfig.options,
        },
        {
          responseType: exportConfig.format === "pdf" || exportConfig.format === "excel" ? "blob" : "json",
        },
      )

      if (exportConfig.format === "pdf" || exportConfig.format === "excel") {
        // Handle file download
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${exportConfig.type}_export.${exportConfig.format === "excel" ? "xlsx" : "pdf"}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        setSuccess("Export completed successfully")
      } else {
        // Handle JSON/CSV export
        const dataStr = JSON.stringify(response.data, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = window.URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${exportConfig.type}_export.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        setSuccess("Export completed successfully")
      }
    } catch (error) {
      console.error("Export error:", error)
      setError(error.response?.data?.message || "Export failed")
    } finally {
      setLoading(false)
    }
  }

  const handleBulkImport = async () => {
    if (!bulkImportConfig.file) {
      setError("Please select a file to import")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")
    setImportResults(null)

    try {
      const formData = new FormData()
      formData.append("file", bulkImportConfig.file)
      formData.append("type", bulkImportConfig.type)
      formData.append("options", JSON.stringify(bulkImportConfig.options))

      const response = await axios.post(`${API_URL}/bulk-import`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      setImportResults(response.data)
      setSuccess(`Import completed: ${response.data.processed} records processed`)
    } catch (error) {
      console.error("Import error:", error)
      setError(error.response?.data?.message || "Import failed")
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = async (type) => {
    try {
      const response = await axios.get(`${API_URL}/templates/${type}`, {
        responseType: "blob",
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${type}_template.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Template download error:", error)
      setError("Failed to download template")
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Export & Bulk Operations Manager</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Export Data</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Type</label>
              <select
                value={exportConfig.type}
                onChange={(e) => setExportConfig({ ...exportConfig, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="timetables">Timetables</option>
                <option value="students">Students</option>
                <option value="courses">Courses</option>
                <option value="faculty">Faculty</option>
                <option value="teaching-practices">Teaching Practices</option>
                <option value="field-works">Field Works</option>
                <option value="analytics">Analytics Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select
                value={exportConfig.format}
                onChange={(e) => setExportConfig({ ...exportConfig, format: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel (XLSX)</option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="xml">XML</option>
              </select>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-3">Filters</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                  <select
                    value={exportConfig.filters.program}
                    onChange={(e) =>
                      setExportConfig({
                        ...exportConfig,
                        filters: { ...exportConfig.filters, program: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">All Programs</option>
                    <option value="FYUP">FYUP</option>
                    <option value="B.Ed.">B.Ed.</option>
                    <option value="M.Ed.">M.Ed.</option>
                    <option value="ITEP">ITEP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={exportConfig.filters.year}
                    onChange={(e) =>
                      setExportConfig({
                        ...exportConfig,
                        filters: { ...exportConfig.filters, year: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">All Years</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <input
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={exportConfig.filters.branch}
                    onChange={(e) =>
                      setExportConfig({
                        ...exportConfig,
                        filters: { ...exportConfig.filters, branch: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
                  <input
                    type="text"
                    placeholder="e.g., A"
                    value={exportConfig.filters.division}
                    onChange={(e) =>
                      setExportConfig({
                        ...exportConfig,
                        filters: { ...exportConfig.filters, division: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-3">Export Options</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.options.includeMetadata}
                    onChange={(e) =>
                      setExportConfig({
                        ...exportConfig,
                        options: { ...exportConfig.options, includeMetadata: e.target.checked },
                      })
                    }
                    className="mr-2"
                  />
                  Include Metadata
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportConfig.options.includeStatistics}
                    onChange={(e) =>
                      setExportConfig({
                        ...exportConfig,
                        options: { ...exportConfig.options, includeStatistics: e.target.checked },
                      })
                    }
                    className="mr-2"
                  />
                  Include Statistics
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                  <select
                    value={exportConfig.options.template}
                    onChange={(e) =>
                      setExportConfig({
                        ...exportConfig,
                        options: { ...exportConfig.options, template: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="standard">Standard</option>
                    <option value="detailed">Detailed</option>
                    <option value="summary">Summary</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                  <select
                    value={exportConfig.options.orientation}
                    onChange={(e) =>
                      setExportConfig({
                        ...exportConfig,
                        options: { ...exportConfig.options, orientation: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
            >
              {loading ? "Exporting..." : "Export Data"}
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Bulk Import</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Import Type</label>
              <select
                value={bulkImportConfig.type}
                onChange={(e) => setBulkImportConfig({ ...bulkImportConfig, type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="students">Students</option>
                <option value="courses">Courses</option>
                <option value="faculty">Faculty</option>
                <option value="rooms">Rooms</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
              <input
                type="file"
                accept=".csv,.xlsx,.json"
                onChange={(e) => setBulkImportConfig({ ...bulkImportConfig, file: e.target.files[0] })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <p className="text-sm text-gray-500 mt-1">Supported formats: CSV, Excel (XLSX), JSON</p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-3">Import Options</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bulkImportConfig.options.upsert}
                    onChange={(e) =>
                      setBulkImportConfig({
                        ...bulkImportConfig,
                        options: { ...bulkImportConfig.options, upsert: e.target.checked },
                      })
                    }
                    className="mr-2"
                  />
                  Update existing records (Upsert)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bulkImportConfig.options.validateOnly}
                    onChange={(e) =>
                      setBulkImportConfig({
                        ...bulkImportConfig,
                        options: { ...bulkImportConfig.options, validateOnly: e.target.checked },
                      })
                    }
                    className="mr-2"
                  />
                  Validate only (don't save)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bulkImportConfig.options.skipErrors}
                    onChange={(e) =>
                      setBulkImportConfig({
                        ...bulkImportConfig,
                        options: { ...bulkImportConfig.options, skipErrors: e.target.checked },
                      })
                    }
                    className="mr-2"
                  />
                  Skip errors and continue
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Size</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={bulkImportConfig.options.batchSize}
                    onChange={(e) =>
                      setBulkImportConfig({
                        ...bulkImportConfig,
                        options: { ...bulkImportConfig.options, batchSize: Number.parseInt(e.target.value) },
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => downloadTemplate(bulkImportConfig.type)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Download Template
              </button>
              <button
                onClick={handleBulkImport}
                disabled={loading || !bulkImportConfig.file}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {loading ? "Importing..." : "Import Data"}
              </button>
            </div>
          </div>

          {importResults && (
            <div className="mt-6 border rounded-lg p-4">
              <h4 className="text-lg font-semibold mb-3">Import Results</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600">{importResults.processed}</div>
                  <div className="text-sm text-gray-600">Processed</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600">{importResults.created}</div>
                  <div className="text-sm text-gray-600">Created</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <div className="text-2xl font-bold text-yellow-600">{importResults.updated}</div>
                  <div className="text-sm text-gray-600">Updated</div>
                </div>
              </div>

              {importResults.errors && importResults.errors.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold text-red-600 mb-2">Errors ({importResults.errors.length})</h5>
                  <div className="max-h-40 overflow-y-auto">
                    {importResults.errors.slice(0, 10).map((error, index) => (
                      <div key={index} className="text-sm text-red-600 mb-1">
                        Row {error.index + 1}: {error.error}
                      </div>
                    ))}
                    {importResults.errors.length > 10 && (
                      <div className="text-sm text-gray-500">
                        ... and {importResults.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setExportConfig({
                ...exportConfig,
                type: "timetables",
                format: "pdf",
                filters: { program: "", year: "", branch: "", division: "", semester: "" },
              })
              handleExport()
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Export All Timetables (PDF)
          </button>
          <button
            onClick={() => {
              setExportConfig({
                ...exportConfig,
                type: "students",
                format: "excel",
                filters: { program: "", year: "", branch: "", division: "", semester: "" },
              })
              handleExport()
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Export All Students (Excel)
          </button>
          <button
            onClick={() => {
              setExportConfig({
                ...exportConfig,
                type: "analytics",
                format: "pdf",
                options: { ...exportConfig.options, includeStatistics: true },
              })
              handleExport()
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Generate Analytics Report
          </button>
          <button
            onClick={() => downloadTemplate("students")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Download Student Template
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportManager
