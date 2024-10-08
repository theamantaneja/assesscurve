import React, { useState } from 'react';
import styled from 'styled-components';

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

  &:hover {
    background-color: #b83c8f;
  }
`;

const ToggleLink = styled.p`
  color: lightgray;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;

  a {
    color: #da4ea2;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      color: #b83c8f;
    }
  }
`;

const SignUpForm = ({ onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    // Handle sign-up logic here...
  };

  return (
    <Modal>
      <FormContainer>
        <form onSubmit={handleSignUpSubmit}>
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
          <Button type="submit">Sign Up</Button>

          {/* Switch to Login Link */}
          <ToggleLink>
            Already have an account? <a onClick={onSwitchToLogin}>Login</a>
          </ToggleLink>
        </form>
      </FormContainer>
    </Modal>
  );
};

export default SignUpForm;