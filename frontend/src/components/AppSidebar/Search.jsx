import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User } from "lucide-react"; // Import User icon

const Search = () => {
  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?query=${query}`
      );

      const users = response.data.users.map((u) => ({
        ...u,
        type: "contact",
      }));
      const groups = response.data.groups.map((g) => ({
        ...g,
        type: "group",
      }));

      setResults([...users, ...groups]);
    } catch (error) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleAction = async (item) => {
    try {
      if (item.type === "contact") {
        // Add to Contact
        await axios.post("http://localhost:5000/api/contacts/add", {
          userId,
          friendId: item._id,
        });
        alert(`Added ${item.firstName} to your contacts`);
        window.dispatchEvent(new Event("contactsUpdated"));
      } else if (item.type === "group") {
        // Join Group
        await axios.post("http://localhost:5000/api/groups/join", {
          groupId: item._id,
          userId,
        });
        alert(`You joined group: ${item.name}`);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Action failed");
    }
  };

  if (!isLogin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64">
        <User className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-600 text-lg text-center">
          Please login to use the search feature.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Find Your Friend or Group
      </h2>
      <div className="flex gap-2 w-full max-w-md">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search here..."
          className="flex-1 px-4 py-2 border bg-white border-orange-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Search
        </button>
      </div>

      {/* Result Section */}
      <div className="mt-6 w-full max-w-md">
        {loading && <p>Searching...</p>}
        {!loading && results.length === 0 && query && (
          <p className="text-gray-500">No results found.</p>
        )}
        {!loading &&
          results.map((item) => (
            <div
              key={item._id || item.id}
              className="bg-white shadow-md p-4 rounded-lg text-center mb-3"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.firstName || item.name}
              </h3>
              <p className="text-sm text-gray-500 capitalize">{item.type}</p>
              <button
                onClick={() => handleAction(item)}
                className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                {item.type === "contact" ? "Add Contact" : "Join Group"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;