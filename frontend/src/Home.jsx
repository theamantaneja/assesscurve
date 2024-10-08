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
  const [showLogin, setShowLogin] = useState(false);  // Hide login form by default
  const [showSignUp, setShowSignUp] = useState(false);
  
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
    setShowSignUp(false);  // Ensure SignUp is hidden
  }, []);

  // Open Sign-Up modal
  const handleOpenSignUp = useCallback(() => {
    console.log('Opening sign-up modal');
    setShowSignUp(true);
    setShowLogin(false);  // Ensure Login is hidden
  }, []);

  return (
    <Container>
      {/* Conditionally render the LoginForm and SignUpForm based on state */}
      {showLogin && <LoginForm onClose={handleCloseModal} onSwitchToSignUp={handleOpenSignUp} />}
      {showSignUp && <SignUpForm onClose={handleCloseModal} />}

      {/* Website sections */}
      <Section><Hero /></Section>
      <Section><Who /></Section>
      <Section><Works /></Section>
      <Section><Contact /></Section>

      {/* RoleSelection component controlling modal state */}
      <Section>
        <RoleSelection
          onLoginClick={handleOpenLogin}   // Trigger login modal open
          onSignUpClick={handleOpenSignUp} // Trigger sign-up modal open
        />
      </Section>
    </Container>
  );
}

export default Home;