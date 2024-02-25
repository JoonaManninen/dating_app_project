import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';


const UserCard = ({ user, handleLike, handleDislike }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleClick = async () => {
    await handleLike();
  };

  const handleDislikeClick = async () => {
    await handleDislike();
  };

  const handleProfileClick = () => {
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <>
    <Card style={{ width: '40%', maxHeight: '30%', textAlign: 'center', alignItems: 'center', height: 'fit-content'}}>
      <Card.Body className='cardbody' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
        <Card.Title>
            <Button variant="link" className="text-primary text-decoration-none d-flex justify-content-center" onClick={handleProfileClick}>
              <h1>{user.name}</h1>
            </Button>
        </Card.Title>
        <Card.Text>{user.bio}</Card.Text>
        <div style={{ marginBottom: '0px' }}>
          <Button variant="primary" onClick={handleClick}>
            Like
          </Button>
          <Button variant="danger" onClick={handleDislikeClick} className="ml-2">
            Dislike
          </Button>
        </div>
      </Card.Body>
    </Card>

    <Modal show={showPopup} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>{user.name}'s Profile</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p><strong>Bio:</strong> {user.bio}</p>
      <p><strong>Register Date: {user.registerDate}</strong></p>
    </Modal.Body>
    </Modal>
    </>

  );
};

export default UserCard;
