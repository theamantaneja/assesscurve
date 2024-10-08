import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  position: relative;
  background: #282c34;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  width: 400px;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  color: white;
  cursor: pointer;

  &:hover {
    color: #b83c8f;
  }
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 12px;
  width: 100%;
  border: 1px solid #da4ea2;
  border-radius: 5px;
  background: #3d1c56;
  color: white;

  &:focus {
    outline: none;
    border-color: #da4ea2;
  }
`;

const Button = styled.button`
  background-color: #da4ea2;
  color: white;
  font-weight: 500;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b83c8f;
  }
`;

const LoginForm = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');  // Assume a default role, can be 'student' or 'teacher'

  const { login } = useContext(UserContext);  // Get login function from UserContext

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    const loginData = {
      username,
      password,
      role
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful, token generated:', data.token);

        // Log the full data received from backend
        console.log('User data received:', data.user);

        // Call the login function to store data in UserContext and localStorage
        login(data.token, data.user.role, data.user.id);

        // Close the modal 
        onClose();
      } else {
        console.error('Error during login:', data.error);
        alert(data.error);  // Display error if login fails
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  // Handle closing the modal when clicking outside the form
  const handleClickOutside = (e) => {
    if (e.target.id === 'modal') {
      onClose(); // Close modal on outside click
    }
  };

  return (
    <Modal id="modal" onClick={handleClickOutside}>
      <FormContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton> {/* Close Button */}
        <h2 style={{ color: '#da4ea2' }}>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Role dropdown */}
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <Button type="submit">Login</Button>
        </form>
      </FormContainer>
    </Modal>
  );
};

export default LoginForm;