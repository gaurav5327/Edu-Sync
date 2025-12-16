"use client"

import { useState } from "react"
import { Copy, RefreshCw, Eye, EyeOff, Key, CheckCircle, AlertTriangle, Sparkles } from "lucide-react"

const APIKeyManager = () => {
  const [apiKeys, setApiKeys] = useState([])
  const [showKeys, setShowKeys] = useState({})
  const [copiedKey, setCopiedKey] = useState("")

  const generateAPIKey = () => {
    const key =
      "sk_" +
      Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

    const newKey = {
      id: Date.now(),
      key: key,
      name: `API Key ${apiKeys.length + 1}`,
      created: new Date().toISOString(),
      lastUsed: null,
      active: true,
    }

    setApiKeys([...apiKeys, newKey])
    return key
  }

  const copyToClipboard = async (text, keyId) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyId)
      setTimeout(() => setCopiedKey(""), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const toggleKeyVisibility = (keyId) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }))
  }

  const toggleKeyStatus = (keyId) => {
    setApiKeys(keys => keys.map(key => 
      key.id === keyId ? { ...key, active: !key.active } : key
    ))
  }

  const deleteKey = (keyId) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(keys => keys.filter(key => key.id !== keyId))
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Integration API Keys</h3>
            <p className="text-indigo-100 text-sm mt-1">
              Generate API keys for external Academic Management Systems to integrate with your timetable generator.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Generate Button */}
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">API Key Management</h4>
            <p className="text-gray-600 text-sm">Create and manage API keys for system integrations</p>
          </div>
          <button
            onClick={generateAPIKey}
            className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            <span>Generate New API Key</span>
          </button>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                    <Key className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{apiKey.name}</h4>
                    <p className="text-sm text-gray-600">
                      Created: {new Date(apiKey.created).toLocaleDateString()}
                      {apiKey.lastUsed && ` • Last used: ${new Date(apiKey.lastUsed).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apiKey.active 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {apiKey.active ? "Active" : "Inactive"}
                  </span>
                  
                  <button
                    onClick={() => toggleKeyStatus(apiKey.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      apiKey.active
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {apiKey.active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>

              {/* API Key Display */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    type={showKeys[apiKey.id] ? "text" : "password"}
                    value={apiKey.key}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {copiedKey === apiKey.id && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => toggleKeyVisibility(apiKey.id)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                  title={showKeys[apiKey.id] ? "Hide key" : "Show key"}
                >
                  {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => deleteKey(apiKey.id)}
                  className="p-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 hover:scale-105"
                  title="Delete key"
                >
                  <AlertTriangle className="w-4 h-4" />
                </button>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900">0</div>
                  <div className="text-gray-600">Requests Today</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900">0</div>
                  <div className="text-gray-600">Total Requests</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                  <div className="font-semibold text-gray-900">100%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {apiKeys.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No API Keys Generated</h3>
            <p className="text-gray-600 mb-4">
              Create your first API key to enable external system integrations
            </p>
            <button
              onClick={generateAPIKey}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg mx-auto"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span>Generate Your First API Key</span>
            </button>
          </div>
        )}

        {/* Integration Guide */}
        {apiKeys.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
              Integration Guide
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Include the API key in your request headers: <code className="bg-white px-2 py-1 rounded">Authorization: Bearer YOUR_API_KEY</code></p>
              <p>• Base URL for API endpoints: <code className="bg-white px-2 py-1 rounded">https://your-domain.com/api/v1/</code></p>
              <p>• Rate limit: 1000 requests per hour per API key</p>
              <p>• Keep your API keys secure and never expose them in client-side code</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default APIKeyManager