import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import ChatList from '../components/ChatList';
import { Button } from 'react-bootstrap';
import './ChatView.css';

const Chats = ({ setViewOption, user, jwtToken }) => {
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  // in the useEffect all users and messages are retrieved.
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/messages?username=${user.username}`, {
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
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

  }, [jwtToken]);


  // Function to go back to mainpage
  const handleToggleEditProfile = () => {
    setViewOption('mainpage');
  };

  return (
    <div className='chatpage'>
      <div className="container">
        {messages.length > 0 ? (
          <div className="row">
            <div className="col-md-4">
              <ChatList messages={messages} jwtToken={jwtToken} setSelectedChat={setSelectedChat} username={user.username} />
            </div>
            <div className="col-md-8">
              {selectedChat && <Chat selectedChat={selectedChat} jwtToken={jwtToken} user={user} />}
            </div>
          </div>
          ) : ( 
          <p>No messages available</p>
          )}
        <Button className="btn btn-secondary ml-2 mt-3" onClick={handleToggleEditProfile}>
          Back to Main Page
        </Button>
      </div>
    </div>
  );
};

export default Chats;
