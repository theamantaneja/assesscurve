import React, { createContext, useState, useEffect } from 'react';
import axios from '../components/axiosConfig';  // Ensure the axios config points to your backend

// Create the context for user authentication
export const UserContext = createContext();

// UserProvider wraps your entire app, giving access to authentication functions (login, logout) and data (role, userId, etc.)
export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Tracks if user is authenticated
  const [role, setRole] = useState(null);  // Tracks the role of the user (e.g., 'teacher', 'student')
  const [userId, setUserId] = useState(null);  // Tracks the unique user's ID
  const [token, setToken] = useState(null);  // Tracks JWT token for authenticated requests

  // Load any existing session info from localStorage on initial component mount (if available)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedRole && storedUserId) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setRole(storedRole);
      setUserId(storedUserId);
    }
  }, []);  // Empty dependency array ensures this runs only once when the component is mounted

  // The login function 
  const login = (token, role, userId) => {
    // Store info in both localStorage and component state
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);

    setIsLoggedIn(true);
    setToken(token);
    setRole(role);
    setUserId(userId);
  };

  // The logout function 
  const logout = async () => {
    try {
      // Call backend to invalidate the session (if needed)
      await axios.post('/api/auth/logout');
      
      // Clear all user-related info from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');

      // Reset state to effectively "log out" the user
      setIsLoggedIn(false);
      setToken(null);
      setRole(null);
      setUserId(null);

      // Optionally, redirect the user to login or homepage after logout
      window.location.href = '/';  // Redirect to homepage
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Make sure your backend uses this token for authenticated requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;  // Inject token into every request for authenticated routes
    } else {
      delete axios.defaults.headers.common['Authorization'];  // Remove token header if not authenticated
    }
  }, [token]);  // Watch for changes to token

  // If necessary, handle session expiration (optional)
  const checkSessionExpiry = () => {
    // An example of handling expiry, can be implemented if tokens have an expiration time
    // You can also use JWT decoding libraries to handle checking for token expiry on the client.
  };

  // Provide authentication data and actions (login, logout, auth info) to all child components of this provider
  return (
    <UserContext.Provider
      value={{ isLoggedIn, role, userId, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};