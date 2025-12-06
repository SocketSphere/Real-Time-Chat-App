import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/authSlice.js";
import { Camera, Save, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "../../config.js";  // Add this import

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id || user?.id;

  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("/default-avatar.png");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_URL}/api/users/${userId}`);
      const data = res.data;

      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setLoginId(data.loginId || "");
      setBio(data.bio || "");
      setAvatar(data.profileImage || "/default-avatar.png");
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setPreview(URL.createObjectURL(file));
      setAvatar(file);
    }
  };

  // Save profile changes
  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("loginId", loginId);
    formData.append("bio", bio);
    if (avatar instanceof File) {
      formData.append("avatar", avatar);
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/users/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update Redux state so Navbar updates immediately
      dispatch(updateUser(res.data));

      // Update local state
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);
      setLoginId(res.data.loginId);
      setBio(res.data.bio);
      setAvatar(res.data.profileImage);
      setPreview(null);
      setEditMode(false);

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errorMsg =
        err.response?.data?.error || err.response?.data?.msg || "Failed to update profile";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-2xl mt-10 text-center transition-all duration-300">
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-2xl mt-10 text-center transition-all duration-300">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">Please log in to view your profile.</p>
          <a 
            href="/login" 
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900 rounded-2xl mt-10 transition-all duration-300">
      {!editMode ? (
        // VIEW MODE
        <div className="text-center space-y-6">
          <div className="relative inline-block">
            <img
              src={preview || avatar}
              alt="User avatar"
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-400 dark:border-blue-500 shadow-lg"
            />
            <div className="absolute bottom-2 right-2 bg-blue-500 dark:bg-blue-600 p-2 rounded-full">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {firstName} {lastName}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{loginId}</p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <p className="text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              {bio || "No bio yet. Tell us something about yourself!"}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">2024</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
              <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">User</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Free</p>
            </div>
          </div>
          
          <button
            onClick={() => setEditMode(true)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        // EDIT MODE
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={preview || avatar}
                alt="User avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 dark:border-blue-500 shadow-lg"
              />
              <label className="absolute bottom-2 right-2 bg-blue-500 dark:bg-blue-600 p-3 rounded-full cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors shadow-md">
                <Camera className="h-5 w-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Click the camera icon to change your avatar
            </p>
          </div>

          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          {/* Username / Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username or Email
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter your username or email"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Tell us something about yourself..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {bio.length}/200 characters
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setPreview(null);
                fetchProfile();
              }}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;