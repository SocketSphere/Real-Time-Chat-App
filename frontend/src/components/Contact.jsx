import { User, Phone, Video, MessageCircleCode, Trash2, UserPlus } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
 import { API_URL } from "../config.js";  // Add this import

const Contact = () => {
  const { user, isLogin, token } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;
  const [myContacts, setMyContacts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch My Contacts
  const fetchMyContacts = async () => {
    if (!isLogin || !userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/contacts/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyContacts(res.data);
    } catch (err) {
      console.log("Error fetching my contacts:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
      }
    }
  };

  // Fetch Recommended Contacts
  const fetchRecommended = async () => {
    if (!isLogin || !userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const allUsers = res.data;
      const excludeIds = [userId, ...myContacts.map((c) => c.friendId)];
      const filtered = allUsers.filter((u) => !excludeIds.includes(u._id));
      setRecommended(filtered.slice(0, 3));
    } catch (err) {
      console.log("Error fetching recommended:", err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (friendId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    
    try {
      await axios.delete(`${API_URL}/api/contacts/delete`, {
        data: { userId, friendId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMyContacts(prev => prev.filter(contact => contact.friendId !== friendId));
      toast.success("Contact deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to delete contact");
    }
  };

  // Add contact
  const handleAddContact = async (friendId) => {
    try {
      await axios.post(`${API_URL}/api/contacts/add`, 
        { userId, friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchMyContacts();
      toast.success("Contact added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add contact");
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchMyContacts();
    }
  }, [isLogin, userId]);

  useEffect(() => {
    if (isLogin && userId) {
      fetchRecommended();
    }
  }, [isLogin, userId, myContacts]);

  // Show login prompt if user not logged in
  if (!isLogin) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <User className="w-10 h-10 animate-spin text-blue-500 dark:text-blue-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-300 text-lg text-center mb-4">
          Please login to view your contacts and recommendations.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300 font-medium"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Contacts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your connections and discover new people
        </p>
      </div>

      {/* My Contacts Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            My Contacts ({myContacts.length})
          </h2>
          <div className="flex gap-3">
            <Link
              to="/search"
              className="flex items-center gap-2 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
            >
              <UserPlus className="w-4 h-4" />
              Add Contact
            </Link>
          </div>
        </div>
        
        {myContacts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
            <User className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No contacts yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start adding contacts to begin chatting
            </p>
            <Link
              to="/search"
              className="inline-block bg-blue-600 dark:bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
            >
              Find Contacts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myContacts.map((c) => (
              <div
                key={c._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
              >
                <div className="p-5">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center mb-3 overflow-hidden border-2 border-blue-100 dark:border-blue-800">
                        {c.profileImage ? (
                          <img
                            src={c.profileImage}
                            alt={`${c.firstName} ${c.lastName}`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div className={`absolute bottom-2 right-2 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        c.isOnline ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'
                      }`}></div>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1">
                      {c.name || c.friendName || `${c.firstName} ${c.lastName}`}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {c.email || c.friendEmail || c.loginId}
                    </p>
                    {c.bio && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {c.bio}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => navigate(`/chat/${c.friendId}`)}
                      className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors duration-200"
                      title="Chat"
                    >
                      <MessageCircleCode className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => alert(`Calling ${c.name || c.friendName}...`)}
                      className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors duration-200"
                      title="Call"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => alert(`Video calling ${c.name || c.friendName}...`)}
                      className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-colors duration-200"
                      title="Video Call"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(c.friendId)}
                      className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-200"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Contacts Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              People You May Know
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Discover and connect with new people
            </p>
          </div>
          <button
            onClick={fetchRecommended}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
        
        {recommended.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No recommendations available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((c) => (
              <div
                key={c._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900 hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 flex items-center justify-center mb-4 overflow-hidden">
                    {c.profileImage ? (
                      <img
                        src={c.profileImage}
                        alt={`${c.firstName} ${c.lastName}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-1">
                    {c.firstName} {c.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    @{c.loginId}
                  </p>
                  {c.bio && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {c.bio}
                    </p>
                  )}
                  
                  <button
                    onClick={() => handleAddContact(c._id)}
                    className="w-full mt-4 bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;