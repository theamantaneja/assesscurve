import React, { createContext, useState, useEffect } from 'react';
import axios from '../components/axiosConfig';  // Ensure you have axios correctly configured

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Tracks if user is logged in
  const [role, setRole] = useState(null);  // Tracks the user's role ('student'/'teacher')
  const [userId, setUserId] = useState(null);  // Tracks the userId from DB
  const [token, setToken] = useState(null);  // Tracks the JWT token

  // On initial load, get session data from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');

    // If session data is available, set state to reflect logged-in status
    if (storedToken && storedRole && storedUserId) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setRole(storedRole);
      setUserId(storedUserId);
    }
  }, []);  // Runs only on component mount

  // Login function that stores necessary data into both localStorage and state
  const login = (token, role, userId) => {
    // Set localStorage values
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);

    // Set UserContext state
    setIsLoggedIn(true);
    setToken(token);
    setRole(role);
    setUserId(userId);
  };

  // Logout function that clears session data from both state and localStorage
  const logout = async () => {
    try {
      // Call backend to invalidate the session
      await axios.post('/api/auth/logout');

      // Clear session data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');

      // Reset UserContext state
      setIsLoggedIn(false);
      setToken(null);
      setRole(null);
      setUserId(null);

      // Redirect user to the homepage after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, role, userId, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};