import React, { useEffect, useState } from "react";
import { Users, Plus, Loader, LogIn } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, isLogin } = useSelector((state) => state.auth);
  // const userId = user?._id;
  const userId = user?._id || user?.id;


  // Clear messages after a delay
  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 5000);
  };

  // Fetch all groups and filter joined groups
  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups");
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
      
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch groups. Please try again later.");
      clearMessages();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [isLogin, userId]);

  // Join a group
  const handleJoin = async (groupId) => {
    if (!isLogin || !userId) {
      setError("Please login to join groups");
      clearMessages();
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:5000/api/groups/join", {
        groupId,
        userId,
      });
      
      // Update groups and joinedGroups
      setGroups((prev) =>
        prev.map((g) => (g._id === res.data._id ? res.data : g))
      );
      setJoinedGroups((prev) => {
        if (!prev.some((g) => g._id === res.data._id)) {
          return [...prev, res.data];
        }
        return prev;
      });
      
      setSuccess(`Successfully joined ${res.data.name}`);
      clearMessages();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to join group");
      clearMessages();
    }
  };

  // Create a new group
  const handleCreateGroup = async () => {
    if (!isLogin || !userId) {
      setError("Please login to create groups");
      clearMessages();
      return;
    }
    
    if (!newGroupName.trim()) {
      setError("Group name is required");
      clearMessages();
      return;
    }
    
    try {
      const res = await axios.post("http://localhost:5000/api/groups/create", {
        name: newGroupName.trim(),
        description: newGroupDescription.trim(),
        owner: userId,
      });
      
      setGroups((prev) => [res.data, ...prev]);
      setJoinedGroups((prev) => [res.data, ...prev]);
      setNewGroupName("");
      setNewGroupDescription("");
      setCreating(false);
      setSuccess(`Group "${res.data.name}" created successfully!`);
      clearMessages();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create group");
      clearMessages();
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Loading groups...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">My Groups</h2>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Authentication warning */}
      {!isLogin && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p className="flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Please login to create or join groups.
          </p>
        </div>
      )}

      {/* Joined Groups */}
      {joinedGroups.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">You haven't joined any groups yet.</p>
          <p className="text-sm text-gray-400 mt-2">
            Join a group below or create your own to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {joinedGroups.map((g) => (
            <div
              key={g._id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col border border-gray-100"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{g.name}</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{g.description || "No description"}</p>
              <div className="mt-auto">
                <p className="text-xs text-gray-400 mb-4">
                  {g.members?.length || 0} members • {g.owner?._id === userId ? "Owner" : "Member"}
                </p>
                <button className="w-full py-2 bg-gray-200 text-gray-700 text-sm rounded cursor-not-allowed font-medium">
                  Joined
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Recommended <span className="text-orange-500">Group</span> </h2>
        <span className="text-sm text-gray-500">
          {groups.length} group{groups.length !== 1 ? 's' : ''} total
        </span>
      </div>
      
      {/* All groups */}
      {groups.filter((g) => !joinedGroups.some((jg) => jg._id === g._id)).length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No other groups available.</p>
          <p className="text-sm text-gray-400 mt-2">
            Create a new group to get started with community building.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {groups
            .filter((g) => !joinedGroups.some((jg) => jg._id === g._id))
            .map((g) => (
              <div
                key={g._id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col border border-gray-100"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{g.name}</h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">{g.description || "No description"}</p>
                <div className="mt-auto">
                  <p className="text-xs text-gray-400 mb-4">
                    {g.members?.length || 0} members • By {g.owner?.name || "Unknown"}
                  </p>
                  <button
                    onClick={() => handleJoin(g._id)}
                    disabled={!isLogin}
                    className={`w-full py-2 text-sm rounded font-medium ${
                      isLogin
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gray-200 cursor-not-allowed text-gray-500"
                    }`}
                  >
                    {isLogin ? "Join Group" : "Login to Join"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Create Group Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center gap-4">
        {creating ? (
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4 border border-gray-200">
            <h3 className="font-semibold text-lg">Create New Group</h3>
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                Group Name *
              </label>
              <input
                id="groupName"
                type="text"
                placeholder="Enter group name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="groupDescription"
                placeholder="Describe the purpose of your group"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setCreating(false);
                  setError("");
                }}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create Group
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              if (!isLogin || !userId) {
                setError("Please login to create a group");
                clearMessages();
                return;
              }
              setCreating(true);
            }}
            className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400 font-medium"
            disabled={!isLogin}
          >
            <Plus className="w-5 h-5" /> Create New Group
          </button>
        )}
      </div>
    </div>
  );
};

export default Group;