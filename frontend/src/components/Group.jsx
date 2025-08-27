import React from "react";
import { Users, MessageSquare, Settings, Plus } from "lucide-react";

const Group = () => {
  const groups = [
    {
      id: 1,
      name: "Developers Hub",
      description: "All about coding & projects",
      members: 24,
    },
    {
      id: 2,
      name: "Music Lovers",
      description: "Share playlists & vibes",
      members: 15,
    },
    {
      id: 3,
      name: "University Friends",
      description: "Class updates & fun",
      members: 32,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-6">Groups</h2>

      {/* Grid of Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {groups.map((g) => (
          <div
            key={g.id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition flex flex-col"
          >
            {/* Group Avatar */}
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>

            {/* Group Info */}
            <h3 className="font-semibold text-lg">{g.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{g.description}</p>
            <p className="text-xs text-gray-400 mb-4">{g.members} members</p>

            {/* Actions */}
            <div className="flex gap-4 mt-auto text-gray-600">
              <MessageSquare className="cursor-pointer hover:text-green-600" />
              <Settings className="cursor-pointer hover:text-gray-700" />
            </div>
          </div>
        ))}
      </div>

      {/* Create New Group */}
      <div className="mt-8 flex justify-center">
        <button className="py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Create New Group
        </button>
      </div>
    </div>
  );
};

export default Group;
