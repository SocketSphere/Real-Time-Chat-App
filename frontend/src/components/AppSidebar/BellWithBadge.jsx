// import { useEffect, useState } from "react";
// import axios from "axios";

// function BellWithBadge({ userId }) {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await axios.get(`http://localhost:5000/api/notifications/${userId}`);
//         const unread = res.data.filter(n => !n.isRead).length;
//         setCount(unread);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 5000); // refresh every 5s
//     return () => clearInterval(interval);
//   }, [userId]);

//   return (
//     <div className="relative">
//       <Bell className="h-5 w-5" />
//       {count > 0 && (
//         <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
//           {count}
//         </span>
//       )}
//     </div>
//   );
// }
