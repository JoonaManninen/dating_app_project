import React, { useState } from 'react';
import './Login.css';
import { Card, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = ({setRegister, setJwtToken, setUser}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegisterButtonClick = () => {
        setRegister(true);
    };

    //Code for parseJwt taken from "https://stackoverflow.com/questions/54036341/how-to-get-user-information-from-jwt-cookie-in-nextjs-reactjs" because Buffer wasn't working with base64 
    function parseJwt(token) {
      if (!token) { return; }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    }

    const handleLogin = async (e) => {
      e.preventDefault();
    
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
    
        if (response.ok) {
          
          const data = await response.json();
          if(data.token) {
            setJwtToken(data.token);
            setUser(parseJwt(data.token));
            console.log('Login successful!');
            navigate("/mainpage")
          }

        } else {
          console.error('Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    };
    
    return (
        <div className="login-container">
        <Card className="login-card">
          <Card.Body>
            <Card.Title>Login</Card.Title>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              </Form.Group>
  
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              </Form.Group>
  
              <Button variant="primary" type="submit">
                Login
              </Button>
  
              <Button variant="secondary" type="button" onClick={handleRegisterButtonClick}>
                Register
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  };
  
  export default Login;




