import { useEffect, useCallback, useState } from 'react';
import { getSocket, connectSocket, disconnectSocket } from '../services/socket';

const logSocketEvent = (event, data) => {
  console.log(`[Socket Event] ${event}:`, data);
};

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const useSocket = (conversationId) => {
  const socket = getSocket();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  // Join a conversation
  const joinConversation = useCallback(() => {
    if (conversationId) {
      logSocketEvent('Joining conversation', { conversationId });
      socket.emit('join_conversation', conversationId);
    }
  }, [conversationId, socket]);

  // Leave a conversation
  const leaveConversation = useCallback(() => {
    if (conversationId) {
      logSocketEvent('Leaving conversation', { conversationId });
      socket.emit('leave_conversation', conversationId);
    }
  }, [conversationId, socket]);

  // Send a message to the socket
  const sendMessage = useCallback((messageData) => {
    return new Promise((resolve, reject) => {
      // Validate senderId is a UUID
      if (!UUID_REGEX.test(messageData.senderId)) {
        const error = 'Invalid senderId: Must be a valid UUID';
        logSocketEvent('Message validation error', { messageData, error });
        setError(error);
        reject(new Error(error));
        return;
      }

      setIsSending(true);
      setError(null);

      logSocketEvent('Sending message', {
        event: 'send_message',
        data: messageData,
        socketId: socket.id,
        connected: socket.connected
      });

      // Set a timeout for the message sending
      const timeout = setTimeout(() => {
        const timeoutError = 'Message sending timed out';
        logSocketEvent('Message timeout', { 
          messageData, 
          error: timeoutError,
          socketId: socket.id,
          connected: socket.connected,
          event: 'send_message'
        });
        setIsSending(false);
        setError(timeoutError);
        reject(new Error(timeoutError));
      }, 10000); // 10 second timeout

      // Emit the message and wait for acknowledgment
      socket.emit('send_message', messageData, (response) => {
        clearTimeout(timeout);
        setIsSending(false);

        if (response?.error) {
          logSocketEvent('Message error', { 
            messageData, 
            error: response.error,
            socketId: socket.id,
            connected: socket.connected
          });
          setError(response.error);
          reject(new Error(response.error));
        } else {
          logSocketEvent('Message sent successfully', { 
            messageData, 
            response,
            socketId: socket.id,
            connected: socket.connected
          });
          resolve(response);
        }
      });
    });
  }, [socket]);

  // Listen for socket connection errors
  useEffect(() => {
    const handleError = (error) => {
      logSocketEvent('Socket error', { 
        error: error.message,
        socketId: socket.id,
        connected: socket.connected
      });
      setError(error.message);
    };

    const handleConnect = () => {
      logSocketEvent('Socket connected', { 
        id: socket.id,
        connected: socket.connected
      });
    };

    const handleDisconnect = (reason) => {
      logSocketEvent('Socket disconnected', { 
        reason,
        socketId: socket.id,
        connected: socket.connected
      });
    };

    const handleReconnect = (attemptNumber) => {
      logSocketEvent('Socket reconnected', { 
        attemptNumber,
        socketId: socket.id,
        connected: socket.connected
      });
    };

    const handleReconnectError = (error) => {
      logSocketEvent('Socket reconnection error', { 
        error: error.message,
        socketId: socket.id,
        connected: socket.connected
      });
    };

    socket.on('connect_error', handleError);
    socket.on('error', handleError);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);
    socket.on('reconnect_error', handleReconnectError);

    return () => {
      socket.off('connect_error', handleError);
      socket.off('error', handleError);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('reconnect', handleReconnect);
      socket.off('reconnect_error', handleReconnectError);
    };
  }, [socket]);

  useEffect(() => {
    // Connect to socket when hook is used
    logSocketEvent('Initializing socket connection', {
      socketId: socket.id,
      connected: socket.connected
    });
    connectSocket();

    // Join conversation if ID is provided
    joinConversation();

    // Cleanup on unmount
    return () => {
      logSocketEvent('Cleaning up socket connection', {
        socketId: socket.id,
        connected: socket.connected
      });
      leaveConversation();
    };
  }, [conversationId, joinConversation, leaveConversation]);

  return {
    socket,
    sendMessage,
    joinConversation,
    leaveConversation,
    isSending,
    error
  };
}; 