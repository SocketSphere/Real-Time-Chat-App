import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User, Search as SearchIcon, Users, Loader2, UserPlus, LogIn } from "lucide-react";

const Search = () => {
  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearchPerformed(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const users = response.data.users?.map((u) => ({
        ...u,
        type: "contact",
      })) || [];
      
      const groups = response.data.groups?.map((g) => ({
        ...g,
        type: "group",
      })) || [];

      setResults([...users, ...groups]);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (item) => {
    if (!userId) {
      alert("Please login to perform this action");
      return;
    }

    try {
      if (item.type === "contact") {
        // Add to Contact
        await axios.post("http://localhost:5000/api/contacts/add", {
          userId,
          friendId: item._id,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert(`Added ${item.firstName} ${item.lastName} to your contacts`);
        window.dispatchEvent(new Event("contactsUpdated"));
      } else if (item.type === "group") {
        // Join Group
        await axios.post("http://localhost:5000/api/groups/join", {
          groupId: item._id,
          userId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert(`You joined group: ${item.name}`);
        window.dispatchEvent(new Event("groupUpdated"));
      }
      
      // Remove from results after successful action
      setResults(prev => prev.filter(result => result._id !== item._id));
      
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        alert(err.response.data.msg || "Already added/joined");
      } else {
        alert(err.response?.data?.msg || "Action failed");
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isLogin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <User className="w-12 h-12 text-blue-500 dark:text-blue-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
          Search Feature
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-md">
          Please login to search for friends and groups, and connect with people.
        </p>
        <Link
          to="/login"
          className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 font-medium"
        >
          <LogIn className="w-5 h-5" />
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Search & Connect
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find friends and groups to expand your network
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for friends or groups..."
              className="w-full pl-12 pr-24 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors duration-300 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                loading || !query.trim()
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <SearchIcon className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
          
          {/* Search Tips */}
          <div className="mt-4 px-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try searching by name, username, or group name
            </p>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="max-w-4xl mx-auto">
        {searchPerformed && !loading && results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              No matches found for "{query}". Try a different search term.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Search Results ({results.length})
              </h2>
              <button
                onClick={() => setResults([])}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear results
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item) => (
                <div
                  key={item._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Item Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.type === "contact" 
                          ? "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50"
                          : "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50"
                      }`}>
                        {item.type === "contact" ? (
                          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 truncate">
                          {item.firstName || item.name}
                          {item.lastName && ` ${item.lastName}`}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === "contact"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                          }`}>
                            {item.type === "contact" ? "User" : "Group"}
                          </span>
                          {item.loginId && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              @{item.loginId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {item.type === "group" && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{item.members?.length || 0} members</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAction(item)}
                      className={`w-full py-3 rounded-xl font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                        item.type === "contact"
                          ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                          : "bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600 text-white"
                      }`}
                    >
                      {item.type === "contact" ? (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Add Contact
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          Join Group
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search History/Recent (Optional) */}
        {!searchPerformed && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Start Searching
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              Enter a name, username, or group name in the search bar above to find people and communities.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                Try: "John"
              </span>
              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                Try: "Tech"
              </span>
              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                Try: "Gaming"
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;