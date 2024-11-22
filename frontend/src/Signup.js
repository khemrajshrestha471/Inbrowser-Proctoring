import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setDialogMessage("Password and Confirm Password did not match!");
      setShowDialog(true);
      setPassword('');
      setConfirmPassword('');
      return;
    }

    setError('');

    axios.post("http://127.0.0.1:8000/students/signup/", { username, email, password})
      .then(result => {
        if (result.status === 201) {
          console.log("User Created Successfully!");
          navigate('/login');
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 400 && err.response.data.error === 'Email already exists') {
          setDialogMessage("An account already exits with entered email. Please use a different email.");
          setShowDialog(true);
        } else {
          setDialogMessage("An unexpected error occurred. Please try again.");
          setShowDialog(true);
        }
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
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">Signup</button>
          <span>Already have an account? <Link to="/login">Log in</Link></span>
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

export default Signup;
