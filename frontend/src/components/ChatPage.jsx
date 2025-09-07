// src/components/ChatPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Phone, Video, Trash2 } from "lucide-react";

const ChatPage = () => {
  const { friendId } = useParams(); // dynamic id from URL
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // ✅ FIX: define messages state
  const [friend, setFriend] = useState(null);

  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  // Fetch friend's details
  const fetchFriend = useCallback(async () => {
    if (!isLogin) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${friendId}`);
      setFriend(res.data);
    } catch (err) {
      console.log("Error fetching friend:", err);
    }
  }, [friendId, isLogin]);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages`, {
        params: { userId: userId, senderId: friendId },
      });
      setMessages(res.data);
    } catch (err) {
      console.log("Error fetching messages:", err);
    }
  }, [userId, friendId]);

  useEffect(() => {
    if (isLogin) {
      fetchFriend();
      fetchMessages();
    }
  }, [isLogin, fetchFriend, fetchMessages]);

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/messages`, {
        sender: userId, // backend expects "sender"
        receiver: friendId, // backend expects "receiver"
        content: message, // backend expects "content"
      });

      setMessage(""); // clear input
      fetchMessages(); // refresh chat
    } catch (err) {
      console.log(err);
    }
  };

  // Delete contact
  const handleDeleteContact = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/delete`, {
        data: { userId, friendId },
      });
      alert("Contact deleted successfully!");
      navigate("/contact"); // redirect back after deletion
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete contact");
    }
  };

  if (!friend) return <p className="p-6">Loading chat...</p>;

  return (
    <div className="p-6">
      {/* Header with name + actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Chat with {friend.firstName} {friend.lastName}
        </h2>
        <div className="flex gap-6 text-gray-600">
          <Phone
            className="cursor-pointer hover:text-blue-500"
            onClick={() => alert(`Calling ${friend.firstName}...`)}
          />
          <Video
            className="cursor-pointer hover:text-green-500"
            onClick={() => alert(`Video calling ${friend.firstName}...`)}
          />
          <Trash2
            className="cursor-pointer text-red-500 hover:text-red-700"
            onClick={handleDeleteContact}
          />
        </div>
      </div>

      {/* Chat Box */}
      <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-100">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet...</p>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`mb-2 p-2 rounded-lg max-w-xs ${
                m.sender._id === userId
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-300 text-black"
              }`}
            >
              <p>{m.content}</p>
              <span className="text-xs text-gray-700 block text-right">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="mt-4 flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded-l-lg px-4 py-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
