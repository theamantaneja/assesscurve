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
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.5);
  width: 400px;
  max-width: 90%;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  color: white;
  cursor: pointer;

  &:hover {
    color: #b83c8f;
  }
`;

const Heading = styled.h2`
  color: #da4ea2;
  margin-bottom: 30px;
  text-align: center;
`;

const Input = styled.input`
  margin-bottom: 20px;
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
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #b83c8f;
  }
`;

const SwitchToSignUp = styled.p`
  color: white;
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  
  a {
    color: #da4ea2;
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      color: #b83c8f;
    }
  }
`;

const LoginForm = ({ onClose, onSwitchToSignUp }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');  // Default role is student

  const { login } = useContext(UserContext);  // Get login function from UserContext

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
  
    const loginData = {
      username,
      password,
      role
    };
  
    try {
      const response = await fetch('https://assesscurve.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Login successful, token generated:', data.token);
        console.log('User data received:', data.user);
        login(data.token, data.user.role, data.user.id);
        onClose();  // Close the modal after successful login
      } else {
        console.error('Error during login:', data.error);
        alert(data.error);  // Show error message
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  // Handle closing the modal on outside click
  const handleClickOutside = (e) => {
    if (e.target.id === 'modal') {
      onClose();  // Close modal on outside click
    }
  };

  return (
    <Modal id="modal" onClick={handleClickOutside}>
      <FormContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton> {/* Close Button */}
        <Heading>Login</Heading>
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
          <Button type="submit">Login</Button>
        </form>

        {/* "Don't have an account? Sign up" section for switching */}
        <SwitchToSignUp>
          Don't have an account? <a onClick={onSwitchToSignUp}>Sign Up</a>
        </SwitchToSignUp>
      </FormContainer>
    </Modal>
  );
};

export default LoginForm;