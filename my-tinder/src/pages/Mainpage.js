import React, { useState, useEffect } from 'react';
import UserCard from '../components/UserCard';
import Menu from '../components/Menu';
import EditProfile from '../components/EditProfile';
import ChatView from './ChatView';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'


const MainPage = ({ jwtToken, user, setUser, setJwtToken, isFetched, setIsFetched}) => {
  const [users, setUsers] = useState([]); // Fetch and set user data
  const [currentUser, setCurrentUser] = useState(null); // Fetch and set current user data
  const [showPopup, setShowPopup] = useState(false); // State to toggle popup visibility
  const navigate = useNavigate();
  const username = user.username
  const [viewOption, setViewOption] = useState('mainpage');

    // Fetch users and current user data on component mount
    useEffect(() => {
      // Check if jwtToken exists, if not redirect to login page
      if (!jwtToken) {
        navigate('/login');
        return;
      }
      fetchUserData();
      
    }, [jwtToken, user.username]);
    // Fetch all the other users who are not matched with logged in user.
    useEffect(() => {

      const fetchUsers = async () => {

        try {
          const response = await fetch(`http://localhost:5000/users/all?username=${user.username}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Filtering already matched users.
            const filteredData = data.filter(obj => !obj.matches.includes(user.username));
            setUsers(filteredData);
            setCurrentUser(filteredData[0]);
          } else {
            console.error('Error fetching users:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();

    }, [jwtToken, user.username]);

    // Fetch user data based on username
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users?username=${user.username}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData)
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    // Handling the like and match cases.
    const handleLike = async () => {
      try {
        const response = await fetch(`http://localhost:5000/users/like?liked=${currentUser.username}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username })
        });
    
        if (response.ok) {
          const data = await response.json();
          const boolean = data.isMatch
          // It was a match
          if (boolean === true) {
            const newUsers = users.slice(1);
            console.log("MATCH");
            setUsers(newUsers);
            setCurrentUser(newUsers[0]);
          } else { // Moving to next user
            const newUsers = users.slice(1);
            setUsers(newUsers);
            setCurrentUser(newUsers[0]);
          }

        } else {
          console.error('Error liking user:', response.statusText);
        }
      } catch (error) {
        console.error('Error liking user:', error);
      }


    };

    // When user dislikes other user we just move to next user.
    const handleDislike = async () => {
      const newUsers = users.slice(1);
      setUsers(newUsers);
      setCurrentUser(newUsers[0]);

    };


    // Function to handle username click and toggle popup visibility
    const handleUsernameClick = () => {
      fetchUserData();
      setShowPopup(!showPopup);
    };

  return (
    <div className='mainpageContainer'>

    {viewOption === 'editprofile' && (
        <EditProfile jwtToken={jwtToken} user={user} setViewOption={setViewOption}/>
    )}
    {viewOption === 'mainpage' && (
      <div>
          <h1 style={{ display: 'flex', justifyContent: 'center'}}onClick={handleUsernameClick}>Welcome {user.username}</h1>
          {showPopup && (
            <div className="popup show">
              <h2>{user.name}</h2>
              <h3>Bio</h3>
              <p>{user.bio}</p>
              <p>Register date: {user.registerDate}</p>
              <button onClick={handleUsernameClick}>Close</button>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {currentUser && <UserCard user={currentUser} handleLike={handleLike} handleDislike={handleDislike}/>}
          </div>
          <Menu setJwtToken={ setJwtToken } setViewOption={setViewOption}/>
      </div>
    )}
    {viewOption === 'chats' && (
      <ChatView setViewOption={setViewOption} user={user} jwtToken={jwtToken}/>
    )}
    </div>
  );
};



export default MainPage;