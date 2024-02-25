import React from 'react';
import Login from '../components/Login';
import Register from '../components/Register'
import './Home.css';

const Home = ({setJwtToken, setUser, jwtToken, user}) => {

    const [registerView, setRegister] = React.useState(null);

    return (
        <div className='homeContainer'>
        <h1>Welcome to Tinder Clone</h1>
        <h2>{jwtToken ? `Welcome ${user.username}!` : ""}</h2>
        {registerView ? (
          <>
            <Register registerView={registerView} setRegister={setRegister}/>
    
          </>
        ) : (
          <>
            <Login setRegister={setRegister} setJwtToken={setJwtToken} setUser={setUser} />
          </>
        )}
        </div>
    )
};

export default Home;
