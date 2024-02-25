import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './EditProfile.css';

const EditProfile = ({ jwtToken, user, setViewOption }) => {
  const [bio, setBio] = useState('');

  // Function which handles the bio change request
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('bio', bio);
    try {
      const response = await fetch(`http://localhost:5000/users/edit?username=${user.username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bio }),
      });
  
      if (response.ok) {
        console.log('Profile updated successfully');
      } else {
        console.error('Profile update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Function to toggle edit profile view
  const handleToggleEditProfile = () => {
    setViewOption('mainpage');
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <div className='form-container'>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="bio">
            <Form.Label>Add your new bio</Form.Label>
            <Form.Control
              className="bio-input"
              type="text"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={user.bio || ''}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save
          </Button>
          <Button className="btn btn-secondary ml-2" onClick={handleToggleEditProfile}>
            Back to Main Page
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
