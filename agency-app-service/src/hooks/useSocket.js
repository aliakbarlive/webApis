import {
  selectAuthenticatedUser,
  selectIsAuthenticated,
} from 'features/auth/authSlice';
import {
  fetchNotifications,
  markAsRead,
} from 'layouts/components/NotificationSlice';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  extraHeaders: {
    'my-custom-header': 'abcd',
  },
});

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const dispatch = useDispatch();
  const { newMessages } = useSelector((state) => state.notifications);
  const user = useSelector(selectAuthenticatedUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated && user) {
      socket.auth = { userId: user.userId };
      socket.connect();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('connect_error', () => {
      console.log('reconnect', process.env.REACT_APP_SERVER_URL);
      setTimeout(() => socket.connect(), 10000);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('hello', (data) => {
      console.log(data);
    });

    socket.on('notify', (data) => {
      console.log(data, ' notify');
      dispatch(markAsRead(newMessages)).then(() => {
        dispatch(fetchNotifications());
      });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('hello');
      socket.off('notify');
    };
  }, []);

  const sendPing = () => {
    socket.emit('hello', 'world');
  };

  return {
    isConnected,
    sendPing,
  };
};
export default useSocket;
