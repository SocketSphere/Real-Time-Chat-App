 import { useState, useEffect } from "react";
 import axios from "axios";
 import { useSelector, useDispatch } from "react-redux";
 import { updateUser } from "../../redux/authSlice.js"; // Make sure this action updates the user in Redux
 import { API_URL } from "../../config.js";  // Add this import

 const ProfileSettings = () => {
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
       setPreview(URL.createObjectURL(file));
       setAvatar(file);
     }
   };
 
   // Save profile changes
   const handleSave = async (e) => {
     e.preventDefault();
     if (!userId) return;
 
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
 
       console.log("Profile updated:", res.data);
 
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
 
       alert("Profile updated successfully!");
       dispatch(updateUser(res.data)); 
     } catch (err) {
       console.error("Failed to update profile:", err);
       const errorMsg =
         err.response?.data?.error || err.response?.data?.msg || "Failed to update profile";
       alert(errorMsg);
     }
   };
 
   if (loading) {
     return (
       <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-center">
         <p>Loading profile...</p>
       </div>
     );
   }
 
   if (!user) {
     return (
       <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 text-center">
         <p>Please log in to view your profile.</p>
       </div>
     );
   }
 
   return (
     <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
       {!editMode ? (
         // VIEW MODE
         <div className="text-center space-y-4">
           <img
             src={preview || avatar}
             alt="User avatar"
             className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-orange-400"
           />
           <h2 className="text-xl font-bold">{firstName} {lastName}</h2>
           <p className="text-gray-600">{loginId}</p>
           <p className="text-gray-500 italic">{bio}</p>
           <button
             onClick={() => setEditMode(true)}
             className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
           >
             Edit Profile
           </button>
         </div>
       ) : (
         // EDIT MODE
         <form onSubmit={handleSave} className="space-y-5">
           {/* Avatar */}
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
 
           {/* First Name */}
           <div>
             <label className="block text-sm font-medium text-gray-700">First Name</label>
             <input
               type="text"
               value={firstName}
               onChange={(e) => setFirstName(e.target.value)}
               className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
             />
           </div>
 
           {/* Last Name */}
           <div>
             <label className="block text-sm font-medium text-gray-700">Last Name</label>
             <input
               type="text"
               value={lastName}
               onChange={(e) => setLastName(e.target.value)}
               className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
             />
           </div>
 
           {/* Username / Email */}
           <div>
             <label className="block text-sm font-medium text-gray-700">Username or Email</label>
             <input
               type="text"
               value={loginId}
               onChange={(e) => setLoginId(e.target.value)}
               className="w-full border bg-white border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
             />
           </div>
 
           {/* Bio */}
           <div>
             <label className="block text-sm font-medium text-gray-700">Bio</label>
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
               onClick={() => {
                 setEditMode(false);
                 setPreview(null);
                 fetchProfile();
               }}
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
 
 export default ProfileSettings;
 