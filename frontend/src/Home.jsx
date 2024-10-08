import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Hero from './components/Hero';
import Who from './components/Who';
import Works from './components/Works';
import Contact from './components/Contact';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import RoleSelection from './components/RoleSelection';

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
  const [showLogin, setShowLogin] = useState(false);  // Assume hidden by default
  const [showSignUp, setShowSignUp] = useState(false);
  
  // Perform logging for debugging purposes
  useEffect(() => {
    console.log('Login Modal State:', showLogin);
    console.log('SignUp Modal State:', showSignUp);
  }, [showLogin, showSignUp]);

  // Close both modals
  const handleCloseModal = useCallback(() => {
    console.log('Closing all modals');
    setShowLogin(false);
    setShowSignUp(false);
  }, []);

  // Open Login modal
  const handleOpenLogin = useCallback(() => {
    console.log('Opening login modal');
    setShowLogin(true);
    setShowSignUp(false);  // Hide Sign-Up modal
  }, []);

  // Open Sign-Up modal
  const handleOpenSignUp = useCallback(() => {
    console.log('Opening sign-up modal');
    setShowSignUp(true);
    setShowLogin(false);  // Hide Login modal
  }, []);

  return (
    <Container>
      {/* Conditionally render the LoginForm and SignUpForm based on modal state */}
      {showLogin && <LoginForm onClose={handleCloseModal} onSwitchToSignUp={handleOpenSignUp} />}
      {showSignUp && <SignUpForm onClose={handleCloseModal} />}

      {/* Website Sections */}
      <Section><Hero /></Section>
      <Section><Who /></Section>
      <Section><Works /></Section>
      <Section><Contact /></Section>

      {/* RoleSelection component controlling modal state */}
      <Section>
        <RoleSelection
          onLoginClick={handleOpenLogin}   // For opening login modal
          onSignUpClick={handleOpenSignUp} // For opening sign-up modal
        />
      </Section>
    </Container>
  );
}

export default Home;