import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
  if (!query) return;
  setLoading(true);
  try {
    const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);

    // mark type for each item
    const users = response.data.users.map(u => ({ ...u, type: "contact" }));
    const groups = response.data.groups.map(g => ({ ...g, type: "group" }));

    setResults([...users, ...groups]);
  } catch (error) {
    console.error(error);
    alert(`Error: ${error.message}`);
  }
  setLoading(false);
};



  const handleAction = (item) => {
    if (item.type === "contact") {
      alert(`Friend request sent to ${item.name}`);
    } else if (item.type === "group") {
      alert(`Request to join ${item.name} sent`);
    }
  };

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
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{item.type}</p>
              <button
                onClick={() => handleAction(item)}
                className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                {item.type === "contact" ? "Send Friend Request" : "Join Group"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Search;
