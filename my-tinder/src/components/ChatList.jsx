import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import './ChatList.css';

const ChatList = ({ messages, jwtToken, setSelectedChat, username }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const chatsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1); // Reset current page when messages change
  }, [messages]);

  // Calculate total pages
  const totalPages = Math.ceil(messages.length / chatsPerPage);

  // Calculate index range for current page
  const indexOfLastChat = currentPage * chatsPerPage;
  const indexOfFirstChat = indexOfLastChat - chatsPerPage;
  const currentChats = messages.slice(indexOfFirstChat, indexOfLastChat);

  // Function to handle chat item click
  const handleChatClick = (id) => {
    setSelectedChat(id);
  };

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <ListGroup>
        {currentChats.map((message) => (
          <ListGroupItem key={message._id} onClick={() => handleChatClick(message._id)}>
            {message.matchUsername === username ? message.username : message.matchUsername}
          </ListGroupItem>
        ))}
      </ListGroup>
      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};

export default ChatList;
