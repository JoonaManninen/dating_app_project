import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Mainpage from './pages/Mainpage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {

  const [jwtToken, setJwtToken] = useState("");
  const [user, setUser] = useState("");
  const [isFetched, setIsFetched] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home setJwtToken={setJwtToken} setUser={setUser} jwtToken={jwtToken} user={user}/>} />
        <Route path="/mainpage" element={<Mainpage 
        jwtToken={jwtToken} user={user} setUser={setUser} 
        setJwtToken={setJwtToken} isFetched={isFetched} setIsFetched={setIsFetched}/>} />
        <Route path="/login" element={<Home setJwtToken={setJwtToken} setUser={setUser} jwtToken={jwtToken} user={user}/>} />
      </Routes>
    </BrowserRouter>
  );
}; 

export default App;