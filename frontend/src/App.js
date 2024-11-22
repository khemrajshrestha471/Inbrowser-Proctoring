import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './home.css'
import homeImage from './images/home.png';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      navigate('/rules');
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="left-image">
          <img src={homeImage} alt="Home" />
        </div>
        <div className="right-content">
          <h1>Welcome to<span>Fuse's</span>Inbrowser Proctoring</h1>
          <p>Want to take exam? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </>
  );
};

export default App;
