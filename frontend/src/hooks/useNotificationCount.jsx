// src/hooks/useNotificationCount.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setNotificationCount } from '../redux/notificationSlice.js';

const useNotificationCount = () => {
  const dispatch = useDispatch();
  const { user, isLogin } = useSelector(state => state.auth);
  const userId = user?._id;

  useEffect(() => {
    if (isLogin && userId) {
      const fetchCount = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/notifications/${userId}/unread`);
          dispatch(setNotificationCount(res.data.count));
        } catch (err) {
          console.error('Error fetching notification count:', err);
        }
      };

      fetchCount();

      // Set up polling every 30 seconds
      const interval = setInterval(fetchCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isLogin, userId, dispatch]);
};

export default useNotificationCount;