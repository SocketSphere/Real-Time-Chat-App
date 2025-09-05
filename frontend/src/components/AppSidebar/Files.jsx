import React, { useState, useEffect } from 'react';
import { 
  Download, Upload, FileText, Image, File, Search, 
  Trash2, Folder, FolderOpen, Plus, ChevronRight, 
  HardDrive, Cloud, FileUp, FolderPlus, Loader 
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  // Fetch files and folders
  const fetchFiles = async () => {
    if (!isLogin) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/files?userId=${userId}&folderId=${currentFolder || ''}`);
      setFiles(response.data.files || []);
      setFolders(response.data.folders || []);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    } finally {
      setLoading(false);
    }
  };

  // Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    if (currentFolder) formData.append('folderId', currentFolder);

    try {
      await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchFiles();
      setShowUploadModal(false);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Create folder
  const createFolder = async (folderName) => {
    if (!folderName.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/files/folder', {
        name: folderName,
        userId,
        parentFolder: currentFolder
      });
      fetchFiles();
    } catch (err) {
      console.error('Failed to create folder:', err);
      alert('Failed to create folder');
    }
  };

  // Download file
  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/files/download/${fileId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download file');
    }
  };

  // Delete file or folder
  const deleteItem = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/${id}?type=${type}`);
      fetchFiles();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete item');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [isLogin, currentFolder]);

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return <Image className="text-blue-500" size={24} />;
    if (fileType.includes('pdf')) return <FileText className="text-red-500" size={24} />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <File className="text-purple-500" size={24} />;
    if (fileType.includes('word')) return <FileText className="text-blue-600" size={24} />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FileText className="text-green-600" size={24} />;
    return <File className="text-gray-500" size={24} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cloud className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Your Files</h2>
          <p className="text-gray-600 mb-6">
            Sign in to view and manage your files across all your devices
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium w-full"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">File Manager</h1>
                <p className="text-blue-100">Organize and access your files</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const folderName = prompt('Enter folder name:');
                  if (folderName) createFolder(folderName);
                }}
                className="flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200"
              >
                <FolderPlus size={18} className="mr-2" /> New Folder
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium"
              >
                <FileUp size={18} className="mr-2" /> Upload Files
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <button
              onClick={() => setCurrentFolder(null)}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              <HardDrive size={16} className="inline mr-2" />
              All Files
            </button>
            {currentFolder && (
              <>
                <ChevronRight size={16} className="mx-2" />
                <span className="text-blue-600">Current Folder</span>
              </>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Loader className="animate-spin mx-auto text-blue-600 mb-4" size={32} />
              <p className="text-gray-600">Loading your files...</p>
            </div>
          ) : (
            <>
              {/* Folders */}
              {filteredFolders.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <FolderOpen className="text-yellow-500 mr-2" size={20} />
                    Folders
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredFolders.map((folder) => (
                      <div
                        key={folder._id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group hover:border-blue-200 bg-gradient-to-b from-white to-gray-50"
                        onClick={() => setCurrentFolder(folder._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FolderOpen className="text-yellow-500 mr-3" size={28} />
                            <div>
                              <h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                                {folder.name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {folder.fileCount} item{folder.fileCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItem(folder._id, 'folder');
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <FileText className="text-blue-500 mr-2" size={20} />
                    Files
                  </h3>
                  <span className="text-sm text-gray-500">
                    {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-gray-50 to-white">
                    <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                    <h4 className="text-lg font-medium text-gray-600 mb-2">No files yet</h4>
                    <p className="text-gray-500 mb-6">Upload your first file to get started</p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                    >
                      <Upload size={18} className="inline mr-2" />
                      Upload Files
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                    <div className="grid grid-cols-1 divide-y divide-gray-200">
                      {filteredFiles.map((file) => (
                        <div
                          key={file._id}
                          className="flex items-center justify-between p-4 hover:bg-white group transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              {getFileIcon(file.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 truncate">{file.name}</h4>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => downloadFile(file._id, file.name)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => deleteItem(file._id, 'file')}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h3 className="text-xl font-bold">Upload File</h3>
              <p className="text-blue-100">Select a file to upload to your storage</p>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-300 transition-all duration-200">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-blue-600" size={32} />
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium inline-block"
                >
                  {uploading ? (
                    <>
                      <Loader className="animate-spin inline mr-2" size={18} />
                      Uploading...
                    </>
                  ) : (
                    'Choose File'
                  )}
                </label>
                <p className="text-sm text-gray-500 mt-4">
                  Maximum file size: 10MB
                </p>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;