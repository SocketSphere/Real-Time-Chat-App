import React, { useState, useEffect } from 'react';
import { 
  Download, Upload, FileText, Image, File, Search, 
  Trash2, Folder, FolderOpen, Plus, ChevronRight, 
  HardDrive, Cloud, FileUp, FolderPlus, Loader2,
  X, FileIcon, Archive, FileSpreadsheet, FileVideo, FileAudio
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const Files = () => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  // Fetch files and folders
  const fetchFiles = async () => {
    if (!isLogin) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files?userId=${userId}&folderId=${currentFolder || ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setFiles(response.data.files || []);
      setFolders(response.data.folders || []);
    } catch (err) {
      console.error('Failed to fetch files:', err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    if (currentFolder) formData.append('folderId', currentFolder);

    try {
      await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('File uploaded successfully!');
      fetchFiles();
      setShowUploadModal(false);
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/files/folder', {
        name: newFolderName,
        userId,
        parentFolder: currentFolder
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Folder created successfully!');
      fetchFiles();
      setShowCreateFolder(false);
      setNewFolderName('');
    } catch (err) {
      console.error('Failed to create folder:', err);
      toast.error(err.response?.data?.error || 'Failed to create folder');
    }
  };

  // Download file
  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/download/${fileId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download started!');
    } catch (err) {
      console.error('Download failed:', err);
      toast.error('Failed to download file');
    }
  };

  // Delete file or folder
  const deleteItem = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/${id}?type=${type}&userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(`${type === 'file' ? 'File' : 'Folder'} deleted successfully!`);
      fetchFiles();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.response?.data?.error || 'Failed to delete item');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [isLogin, currentFolder, token]);

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return <Image className="text-blue-500 dark:text-blue-400" size={24} />;
    if (fileType.includes('pdf')) return <FileText className="text-red-500 dark:text-red-400" size={24} />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('tar')) 
      return <Archive className="text-purple-500 dark:text-purple-400" size={24} />;
    if (fileType.includes('word') || fileType.includes('document')) 
      return <FileText className="text-blue-600 dark:text-blue-400" size={24} />;
    if (fileType.includes('excel') || fileType.includes('sheet')) 
      return <FileSpreadsheet className="text-green-600 dark:text-green-400" size={24} />;
    if (fileType.includes('video')) return <FileVideo className="text-purple-600 dark:text-purple-400" size={24} />;
    if (fileType.includes('audio')) return <FileAudio className="text-orange-600 dark:text-orange-400" size={24} />;
    return <FileIcon className="text-gray-500 dark:text-gray-400" size={24} />;
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

  const getTotalSize = () => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  if (!isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 max-w-md w-full text-center transition-colors duration-300">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cloud className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Access Your Files</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900 overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <HardDrive className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">File Manager</h1>
                <p className="text-blue-100">Organize and access your files</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateFolder(true)}
                className="flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200"
              >
                <FolderPlus size={18} className="mr-2" /> New Folder
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                <FileUp size={18} className="mr-2" /> Upload Files
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {/* Stats & Breadcrumb */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <button
                onClick={() => setCurrentFolder(null)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center"
              >
                <HardDrive size={16} className="inline mr-2" />
                All Files
              </button>
              {currentFolder && (
                <>
                  <ChevronRight size={16} className="mx-2" />
                  <span className="text-blue-600 dark:text-blue-400">Current Folder</span>
                </>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatFileSize(getTotalSize())} • {files.length} files
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="animate-spin mx-auto text-blue-600 dark:text-blue-400 mb-4" size={32} />
              <p className="text-gray-600 dark:text-gray-300">Loading your files...</p>
            </div>
          ) : (
            <>
              {/* Folders */}
              {filteredFolders.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <FolderOpen className="text-yellow-500 mr-2" size={20} />
                    Folders
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFolders.map((folder) => (
                      <div
                        key={folder._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg dark:hover:shadow-gray-900 transition-all duration-200 cursor-pointer group hover:border-blue-200 dark:hover:border-blue-800 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                        onClick={() => setCurrentFolder(folder._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FolderOpen className="text-yellow-500 mr-3" size={28} />
                            <div className="min-w-0">
                              <h4 className="font-medium text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                                {folder.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {folder.fileCount} item{folder.fileCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteItem(folder._id, 'folder');
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                            title="Delete folder"
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
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                    <FileText className="text-blue-500 dark:text-blue-400 mr-2" size={20} />
                    Files
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <FileText className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                      {searchQuery ? 'No matching files' : 'No files yet'}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      {searchQuery ? 'Try a different search term' : 'Upload your first file to get started'}
                    </p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                    >
                      <Upload size={18} className="inline mr-2" />
                      Upload Files
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
                    <div className="divide-y divide-gray-200 dark:divide-gray-600">
                      {filteredFiles.map((file) => (
                        <div
                          key={file._id}
                          className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-gray-800 group transition-all duration-200"
                        >
                          <div className="flex items-center space-x-4 min-w-0">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                              {getFileIcon(file.type, file.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 dark:text-gray-100 truncate">{file.name}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <button
                              onClick={() => downloadFile(file._id, file.name)}
                              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => deleteItem(file._id, 'file')}
                              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Upload File</h3>
                  <p className="text-blue-100">Select a file to upload to your storage</p>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-white/80 hover:text-white p-1 rounded-lg transition-colors duration-200"
                  disabled={uploading}
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 bg-gray-50 dark:bg-gray-700/30">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-blue-600 dark:text-blue-400" size={32} />
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
                  className={`cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium inline-block ${
                    uploading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin inline mr-2" size={18} />
                      Uploading...
                    </>
                  ) : (
                    'Choose File'
                  )}
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-colors duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Create New Folder</h3>
                  <p className="text-blue-100">Enter a name for your new folder</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="text-white/80 hover:text-white p-1 rounded-lg transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                  placeholder="Enter folder name..."
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Create Folder
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