import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

const Chat = ({ selectedChat, jwtToken, user }) => {
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat, jwtToken]);

  // Making the view correct
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  // Fetching the messages users have with each other
  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/messages/chat/?id=${selectedChat}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      console.log(data, "kek");
      setChat(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  // Sneding message to other user.
  const sendMessage = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/messages/send/?id=${selectedChat}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ text: message, username: user.username }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const data = await response.json();
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="chat-container" ref={chatContainerRef}>
      {chat.map((message, index) => (
        <div key={index} className={message.senderId === user.username ? 'user-bubble chat-bubble' : 'other-bubble chat-bubble'}>
          <div className="message-text">{message.content}</div>
          <div className="message-time">{message.timestamp}</div>
        </div>
      ))}
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
