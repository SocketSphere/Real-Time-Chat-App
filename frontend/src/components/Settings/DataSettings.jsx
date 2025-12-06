import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from "../../config.js";  // Add this import

const DataSettings = ({ userId }) => {
  const [loading, setLoading] = useState(false);

  const exportData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/data/${userId}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `chat-data-${new Date().toISOString()}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    if (!window.confirm('Are you sure you want to clear all your data? This action cannot be undone.')) {
      return;
    }
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/data/${userId}/clear`);
      toast.success('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Data Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">2.3 GB</p>
            <p className="text-sm text-gray-600">Media Storage</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">1.2 GB</p>
            <p className="text-sm text-gray-600">Messages</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">350 MB</p>
            <p className="text-sm text-gray-600">App Data</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Data Management</h3>
        <div className="space-y-3">
          <button 
            onClick={exportData}
            disabled={loading}
            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <Download className="text-gray-400" />
              <span>Export Chat Data</span>
            </div>
            <span className="text-sm text-gray-500">ZIP file</span>
          </button>
          
          <button 
            onClick={clearData}
            disabled={loading}
            className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-lg transition-colors text-red-600 disabled:opacity-50"
          >
            <div className="flex items-center space-x-3">
              <Trash2 className="text-red-400" />
              <span>Clear All Data</span>
            </div>
          </button>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Automatic Media Download</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Wi-Fi</p>
              <p className="text-sm text-gray-500">Download media automatically when connected to Wi-Fi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                defaultChecked
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mobile Data</p>
              <p className="text-sm text-gray-500">Download media automatically when using mobile data</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;