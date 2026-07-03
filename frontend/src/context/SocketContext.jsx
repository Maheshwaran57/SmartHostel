import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketUrl = window.location.origin;
      const newSocket = io(socketUrl, {
        auth: { token }
      });

      newSocket.on('notification:new', (data) => {
        toast(data.message, {
          icon: '🔔',
          style: {
            borderRadius: '10px',
            background: '#1e293b',
            color: '#fff',
          }
        });
      });

      newSocket.on('complaint:updated', (data) => {
        toast.info(`Complaint "${data.title}" updated: ${data.status}`);
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);