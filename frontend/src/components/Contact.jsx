import React from "react";
import { User, Phone, Video, MoreVertical } from "lucide-react";

const Contact = () => {
  const contacts = [
    { id: 1, name: "Alice Johnson", status: "online", lastSeen: "Now" },
    { id: 2, name: "Bob Smith", status: "offline", lastSeen: "2h ago" },
    { id: 3, name: "Charlie Brown", status: "online", lastSeen: "Now" },
    { id: 4, name: "Diana Prince", status: "offline", lastSeen: "5m ago" },
    { id: 5, name: "Ethan Hunt", status: "online", lastSeen: "Now" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6">Contacts</h2>

      {/* Grid of Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-gray-600" />
            </div>

            {/* Contact Info */}
            <h3 className="font-medium text-lg">{c.name}</h3>
            <p className="text-sm text-gray-500">
              {c.status === "online" ? "🟢 Online" : `Last seen ${c.lastSeen}`}
            </p>

            {/* Actions */}
            <div className="flex gap-4 mt-4 text-gray-600">
              <Phone className="cursor-pointer hover:text-blue-500" />
              <Video className="cursor-pointer hover:text-blue-500" />
              <MoreVertical className="cursor-pointer hover:text-gray-800" />
            </div>
          </div>
        ))}
      </div>

      {/* Add New Contact Button */}
      <div className="mt-8 flex justify-center">
        <button className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Add New Contact
        </button>
      </div>
    </div>
  );
};

export default Contact;
