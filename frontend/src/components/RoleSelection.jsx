import React, { useContext } from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { UserContext } from '../context/UserContext';  // Import UserContext

// Styled Components for the UI
const RoleContainer = styled.div`
  text-align: center;
  color: white;
  margin-top: 50px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const Button = styled.button`
  font-size: 1.5rem;
  margin: 10px;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const RoleSelection = () => {
  const [showLogin, setShowLogin] = React.useState(false);
  const [showSignUp, setShowSignUp] = React.useState(false);

  // Grab the context values (like isLoggedIn) from UserContext
  const { isLoggedIn, login } = useContext(UserContext);

  // Handle successful login and update context (token, role, userId)
  const handleSuccessfulLogin = (token, role, userId) => {
    console.log("Login was successful! Updating state in UserContext.");
    login(token, role, userId);  // Update context with token, role, userId
    setShowLogin(false);  // Close the login modal
  };

  // Handle successful signup and update context (similar to login)
  const handleSuccessfulSignup = (token, role, userId) => {
    console.log("Signup was successful! Updating state in UserContext.");
    login(token, role, userId);  // Update context with token, role, userId
    setShowSignUp(false);  // Close the signup modal
  };

  // Handle accessing the chatbot after login/signup
  const handleAccessChatbot = () => {
    if (isLoggedIn) {
      console.log("User is logged in. Redirecting to /chat");
      window.location.href = '/chat';  // Redirect to chat page
    }
  };

  return (
    <RoleContainer>
      {!isLoggedIn ? (  // Conditional rendering based on login status
        <>
          <Title>Log In or Sign Up to Access Your AI-Powered Educational Tool</Title>
          
          {/* Show login modal button */}
          <Button onClick={() => setShowLogin(true)}>Log In</Button>

          {/* Show sign-up modal button */}
          <Button onClick={() => setShowSignUp(true)}>Sign Up</Button>

          {/* Modal for login */}
          {showLogin && (
            <LoginForm 
              onClose={() => setShowLogin(false)} 
              onSuccess={handleSuccessfulLogin} 
            />
          )}

          {/* Modal for sign-up */}
          {showSignUp && (
            <SignUpForm 
              onClose={() => setShowSignUp(false)} 
              onSuccess={handleSuccessfulSignup} 
            />
          )}
        </>
      ) : (
        <>
          {/* If logged in show chatbot access */}
          <Title>Welcome! You can now access your AI-powered chatbot</Title>
          <Button onClick={handleAccessChatbot}>Access Chatbot</Button>
        </>
      )}
    </RoleContainer>
  );
};

export default RoleSelection;