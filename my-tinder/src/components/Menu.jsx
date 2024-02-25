import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Menu.css';

const Menu = ({ setJwtToken, setViewOption }) => {
  const navigate = useNavigate();

  // Function to handle logout
  const handleLogout = () => {
    setJwtToken(null);
    navigate('/');
  };

  // Function to toggle edit profile view
  const handleToggleEditProfile = () => {
    setViewOption('editprofile');
  };

  // Function to toggle chatview
  const handleToggleChats = () => {
    setViewOption('chats');
  };

  return (
    <div className="fixed-bottom d-flex justify-content-center">
      <div className="menu-container">
        <button className="menu-button" onClick={handleToggleEditProfile}>
          Edit Profile
        </button>
        <button className="menu-button" onClick={handleToggleChats}>
          View Chats
        </button>
        <button className="menu-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Menu;
