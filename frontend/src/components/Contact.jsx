import { User, Phone, Video, MoreVertical } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const [myContacts, setMyContacts] = useState([]);
  const [recommended, setRecommended] = useState([]);

  // Fetch My Contacts
  const fetchMyContacts = async () => {
    if (!isLogin) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/contacts/${userId}`);
      setMyContacts(res.data);
    } catch (err) {
      console.log("Error fetching my contacts:", err);
    }
  };

  // Fetch Recommended Contacts
  const fetchRecommended = async () => {
    if (!isLogin) return;
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      const allUsers = res.data;

      const excludeIds = [userId, ...myContacts.map((c) => c.friendId)];
      const filtered = allUsers.filter((u) => !excludeIds.includes(u._id));

      setRecommended(filtered.slice(0, 3));
    } catch (err) {
      console.log("Error fetching recommended:", err);
    }
  };

  // Add contact
  const handleAddContact = async (friendId) => {
    try {
      await axios.post("http://localhost:5000/api/contacts/add", { userId, friendId });
      // Refresh contact list after adding

      fetchMyContacts();
      alert("Contact added successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add contact");
    }
  };

  useEffect(() => {
    if (isLogin) fetchMyContacts();
  }, [isLogin]);

  useEffect(() => {
    if (myContacts.length >= 0) fetchRecommended();
  }, [myContacts]);

  // Show login prompt if user not logged in
 // Show login prompt if user not logged in
    if (!isLogin) {
      return (
        <div className="p-6 flex flex-col items-center justify-center h-64">
          <User className="w-10 h-10 animate-spin text-orange-500 mb-4" />
          <p className="text-gray-600 text-lg text-center">
            Please login to view your contacts and recommendations.
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
    <div className="p-6">
      {/* My Contacts */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold mb-4">My Contacts</h2>
        <Link
          to="/search"
          className="font-bold bg-orange-200 rounded-md px-4 py-2 text-blue-500 hover:text-blue-600"
        >
          Add Contact
        </Link>
      </div>

      {myContacts.length === 0 ? (
        <p className="text-gray-500 mb-6">No contacts yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {myContacts.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                <User className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="font-medium text-lg">{c.name || c.friendName}</h3>
              <p className="text-sm text-gray-500">{c.email || c.friendEmail}</p>
              <div className="flex gap-4 mt-4 text-gray-600">
                <Phone
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => alert(`Calling ${c.name || c.friendName}...`)}
                />
                <Video
                  className="cursor-pointer hover:text-green-500"
                  onClick={() => alert(`Video calling ${c.name || c.friendName}...`)}
                />
                <MoreVertical className="cursor-pointer hover:text-gray-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Contacts */}
      <h2 className="text-2xl font-semibold mb-4">Recommended</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommended.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="font-medium text-lg">{c.firstName} {c.lastName}</h3>
            <p className="text-sm text-gray-500">{c.loginId}</p>
            <div className="flex gap-4 mt-4 text-gray-600">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                onClick={() => handleAddContact(c._id)}
              > 
                Add Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
