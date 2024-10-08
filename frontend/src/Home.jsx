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
  const [showLogin, setShowLogin] = useState(false);  // Set login window to hidden by default
  const [showSignUp, setShowSignUp] = useState(false);
  
  // Logging whenever modal visibility changes for debugging purpose
  useEffect(() => {
    console.log('showLogin:', showLogin);
    console.log('showSignUp:', showSignUp);
  }, [showLogin, showSignUp]);

  // Function to close both modals
  const handleCloseModal = useCallback(() => {
    console.log('Closing any open modal');
    setShowLogin(false);
    setShowSignUp(false);
  }, []);

  // Function to open the login modal
  const handleOpenLogin = useCallback(() => {
    console.log('Opening login modal');
    setShowLogin(true);
    setShowSignUp(false);
  }, []);

  // Function to open the sign-up modal
  const handleOpenSignUp = useCallback(() => {
    console.log('Opening sign-up modal');
    setShowSignUp(true);
    setShowLogin(false);
  }, []);

  return (
    <Container>
      {/* Conditionally render Login or SignUp modals when the respective state is true */}
      {showLogin && <LoginForm onClose={handleCloseModal} />}
      {showSignUp && <SignUpForm onClose={handleCloseModal} />}

      {/* Main website sections */}
      <Section><Hero /></Section>
      <Section><Who /></Section>
      <Section><Works /></Section>
      <Section><Contact /></Section>

      {/* Pass modal open handlers to RoleSelection */}
      <Section>
        <RoleSelection
          onLoginClick={handleOpenLogin}   // Pass login click handler
          onSignUpClick={handleOpenSignUp}  // Pass sign-up click handler
        />
      </Section>
    </Container>
  );
}

export default Home;