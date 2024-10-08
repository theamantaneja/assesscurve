import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Hero from './components/Hero';
import Who from './components/Who';
import Works from './components/Works';
import Contact from './components/Contact';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import RoleSelection from './components/RoleSelection';
import { UserContext } from '../context/UserContext';  // Import the UserContext to access logged-in state

const Container = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overflow-y: auto;
  scrollbar-width: none;
  color: white;
  background: url('./img/bg.jpeg') no-repeat center center fixed;
  background-size: cover;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Section = styled.div`
  height: 100vh;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

function Home() {
  const [showLogin, setShowLogin] = useState(false);  // Manage login modal state
  const [showSignUp, setShowSignUp] = useState(false);  // Manage sign-up modal state

  // Access logged-in state from UserContext (optional, if you want to conditionally render content based on logged-in state)
  const { isLoggedIn, role } = React.useContext(UserContext);

  useEffect(() => {
    console.log('Login Modal State:', showLogin);
    console.log('SignUp Modal State:', showSignUp);
  }, [showLogin, showSignUp]);  // Log modal state changes to debug modal visibility

  // Function to close both modals
  const handleCloseModal = useCallback(() => {
    console.log('Closing all modals');
    setShowLogin(false);
    setShowSignUp(false);
  }, []);

  // Function to open the Login modal
  const handleOpenLogin = useCallback(() => {
    console.log('Opening login modal');
    setShowLogin(true);
    setShowSignUp(false);  // Hide Sign-Up modal when login is open
  }, []);

  // Function to open the Sign-Up modal
  const handleOpenSignUp = useCallback(() => {
    console.log('Opening sign-up modal');
    setShowSignUp(true);
    setShowLogin(false);  // Hide Login modal when sign-up is open
  }, []);

  return (
    <Container>
      {/* Conditionally render the LoginForm and SignUpForm based on modal state */}
      {showLogin && <LoginForm onClose={handleCloseModal} onSwitchToSignUp={handleOpenSignUp} />}
      {showSignUp && <SignUpForm onClose={handleCloseModal} onSwitchToLogin={handleOpenLogin} />}

      {/* Website sections */}
      <Section><Hero /></Section>
      <Section><Who /></Section>
      <Section><Works /></Section>
      <Section><Contact /></Section>

      {/* RoleSelection controls which modal (login or sign-up) to open */}
      <Section>
        <RoleSelection
          onLoginClick={handleOpenLogin}    // Open login modal when "Login" button is clicked
          onSignUpClick={handleOpenSignUp}  // Open sign-up modal when "Sign Up" button is clicked
        />
      </Section>
    </Container>
  );
}

export default Home;