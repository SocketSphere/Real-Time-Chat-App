import React, { useEffect, useState } from "react";
import { Users, Plus, Loader, LogIn, Trash2, User } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;
  const navigate = useNavigate();

  // Fetch all groups and filter joined groups
  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setGroups(res.data);
      
      if (isLogin && userId) {
        const joined = res.data.filter(
          (g) =>
            g.owner?._id === userId ||
            g.members.some((m) => m._id === userId)
        );
        setJoinedGroups(joined);
      } else {
        setJoinedGroups([]);
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
      } else {
        toast.error("Failed to fetch groups. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(isLogin && userId) {
      fetchGroups();
    }
    const handler = () => fetchGroups();
    window.addEventListener("groupUpdated", handler);

    return () => window.removeEventListener("groupUpdated", handler);
  }, [isLogin, userId, token]);

  // Join a group
  const handleJoin = async (groupId) => {
    if (!isLogin || !userId) {
      toast.error("Please login to join groups");
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:5000/api/groups/join", {
        groupId,
        userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setGroups((prev) =>
        prev.map((g) => (g._id === res.data._id ? res.data : g))
      );
      
      setJoinedGroups((prev) => {
        if (!prev.some((g) => g._id === res.data._id)) {
          return [...prev, res.data];
        }
        return prev;
      });
      
      toast.success(`Successfully joined ${res.data.name}`);
      
      window.dispatchEvent(new Event("groupUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to join group");
    }
  };

  // Delete a group (only for owners)
  const handleDeleteGroup = async (groupId) => {
    if (!isLogin || !userId) {
      toast.error("Please login to delete groups");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/groups/delete`, {
        data: { groupId, userId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setGroups((prev) => prev.filter((g) => g._id !== groupId));
      setJoinedGroups((prev) => prev.filter((g) => g._id !== groupId));
      
      toast.success("Group deleted successfully");
      
      window.dispatchEvent(new Event("groupUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to delete group");
    }
  };

  // Leave a group
  const handleLeaveGroup = async (groupId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/groups/leave", {
        groupId,
        userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setGroups((prev) => prev.map((g) => (g._id === res.data.group._id ? res.data.group : g)));
      setJoinedGroups((prev) => prev.filter((g) => g._id !== groupId));
      toast.success("You left the group successfully");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to leave group");
    }
  };

  // Create a new group
  const handleCreateGroup = async () => {
    if (!isLogin || !userId) {
      toast.error("Please login to create groups");
      return;
    }
    
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:5000/api/groups/create", {
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        owner: userId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setGroups((prev) => [res.data, ...prev]);
      setJoinedGroups((prev) => [res.data, ...prev]);
      setNewGroupName("");
      setNewGroupDescription("");
      setCreating(false);
      toast.success(`Group "${res.data.name}" created successfully!`);
      
      window.dispatchEvent(new Event("groupUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to create group");
    }
  };

  // Get recommended groups (not joined, limited to 3)
  const getRecommendedGroups = () => {
    const notJoined = groups.filter((g) => 
      !joinedGroups.some((jg) => jg._id === g._id)
    );
    
    return notJoined.slice(0, 3);
  };

  // Check if user is the owner of a group
  const isGroupOwner = (group) => {
    return group.owner?._id === userId;
  };

  if (!isLogin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Loader className="w-10 h-10 animate-spin text-blue-500 dark:text-blue-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-300 text-lg text-center mb-4">
          Please login to view and join groups.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Groups
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Join communities, create your own, and collaborate with others
        </p>
      </div>

      {/* Joined Groups Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              My Groups ({joinedGroups.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Groups you've created or joined
            </p>
          </div>
        </div>
        
        {joinedGroups.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
            <Users className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No groups yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Join a group below or create your own to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedGroups.map((g) => (
              <div
                key={g._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1 truncate">
                        {g.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                        {g.description || "No description"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3" />
                        <span>{g.members?.length || 0} members</span>
                        <span className="mx-1">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${isGroupOwner(g) ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                          {isGroupOwner(g) ? "Owner" : "Member"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/group/${g._id}`)}
                      className="flex-1 py-2.5 px-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Open Chat
                    </button>
                    
                    {isGroupOwner(g) ? (
                      <button 
                        onClick={() => handleDeleteGroup(g._id)} 
                        className="py-2.5 px-4 bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 text-white text-sm rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                        title="Delete Group"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleLeaveGroup(g._id)} 
                        className="py-2.5 px-4 bg-gray-600 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors duration-300"
                      >
                        Leave
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Groups Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Discover Groups
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Join communities that match your interests
            </p>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {getRecommendedGroups().length} of {groups.length - joinedGroups.length} available
          </span>
        </div>
        
        {getRecommendedGroups().length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
            <Users className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              {joinedGroups.length > 0 
                ? "You've joined all available groups!" 
                : "No groups available"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {joinedGroups.length > 0 
                ? "Check back later for new groups or create your own." 
                : "Be the first to create a group!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {getRecommendedGroups().map((g) => (
              <div
                key={g._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1 truncate">
                        {g.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                        {g.description || "No description"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <User className="w-3 h-3" />
                        <span>{g.members?.length || 0} members</span>
                        <span className="mx-1">•</span>
                        <span>Created by {g.owner?.name || "Unknown"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleJoin(g._id)}
                    disabled={!isLogin}
                    className={`w-full py-3 text-sm rounded-lg font-medium transition-colors duration-300 ${
                      isLogin
                        ? "bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {isLogin ? "Join Group" : "Login to Join"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Create Your Own Group
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start a community around your interests
            </p>
          </div>
          
          {creating ? (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md dark:shadow-gray-900 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-4">
                Create New Group
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Group Name *
                  </label>
                  <input
                    id="groupName"
                    type="text"
                    placeholder="Enter group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="groupDescription"
                    placeholder="Describe the purpose of your group"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    onClick={() => {
                      setCreating(false);
                      setNewGroupName("");
                      setNewGroupDescription("");
                    }}
                    className="py-2.5 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    className="py-2.5 px-6 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors duration-300 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create Group
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => {
                  if (!isLogin || !userId) {
                    toast.error("Please login to create a group");
                    return;
                  }
                  setCreating(true);
                }}
                className="py-3 px-8 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2 mx-auto disabled:bg-gray-400 dark:disabled:bg-gray-700 font-medium"
                disabled={!isLogin}
              >
                <Plus className="w-5 h-5" /> Create New Group
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Group;