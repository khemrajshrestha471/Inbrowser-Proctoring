import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';
import Navbar from './Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      navigate('/rules'); // Redirect to /rules if user is already logged in
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8000/students/login/", { email, password }, { withCredentials: true })
    .then(result => {
      if (result.data.message === "Login successful!") {
        const {id, email, username } = result.data;
        localStorage.setItem("user", JSON.stringify({id, email, username }));
        navigate('/rules', { state: { user: {id, email, username } } });
      } else {
        setDialogMessage(result.data.message); // Backend error messages will be shown
        setShowDialog(true);
        setEmail('');
        setPassword('');
      }
    })
    .catch(err => {
      setDialogMessage("An unexpected error occurred. Please try again.");
      setShowDialog(true);
      setEmail('');
      setPassword('');
      console.log(err);
    });
  };


  const closeDialog = () => {
    setShowDialog(false);
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <h1>Inbrowser Proctoring</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
        </form>

        {showDialog && (
          <div className="dialog-overlay">
            <div className="dialog-box">
              <h2>Error</h2>
              <p>{dialogMessage}</p>
              <button onClick={closeDialog}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;