import React, { useState } from "react";

const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@email.com");
  const [bio, setBio] = useState("Hello! I'm using the chat app.");
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [preview, setPreview] = useState(null);

  // avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setAvatar(file);
    }
  };

  // save changes
  const handleSave = (e) => {
    e.preventDefault();

    // prepare form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    console.log("Profile updated:", { name, email, bio, avatar });
    setEditMode(false); // go back to view mode
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      {!editMode ? (
        // -------- VIEW MODE --------
        <div className="text-center space-y-4">
          <img
            src={preview || avatar}
            alt="User avatar"
            className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-orange-400"
          />
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-500 italic">{bio}</p>
          <button
            onClick={() => setEditMode(true)}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        // -------- EDIT MODE --------
        <form onSubmit={handleSave} className="space-y-5">
          <div className="flex flex-col items-center">
            <img
              src={preview || avatar}
              alt="User avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-orange-400 mb-3"
            />
            <label className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
