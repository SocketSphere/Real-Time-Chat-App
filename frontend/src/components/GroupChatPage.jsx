// src/components/GroupChatPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const GroupChatPage = () => {
  const { groupId } = useParams();
  const { user, isLogin } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch group details
  const fetchGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
      setGroup(res.data);
    } catch (err) {
      console.error("Error fetching group:", err);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/messages`, {
        params: { groupId },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/messages", {
        sender: userId,
        group: groupId,
        content: message,
      });
      setMessage("");
      fetchMessages(); // refresh chat
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchGroup();
      fetchMessages();
    }
  }, [groupId, isLogin]);

  if (!group) return <p className="p-6">Loading group chat...</p>;

  return (
    <div className="p-6">
      {/* Group Header */}
      <h2 className="text-2xl font-bold mb-4">Group: {group.name}</h2>
      <p className="text-gray-600 mb-6">{group.description || "No description"}</p>

      {/* Messages Box */}
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
              <p className="font-semibold">{m.sender.username}</p>
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

      {/* Input Box */}
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

export default GroupChatPage;
