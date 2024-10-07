import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Hero from "./components/Hero";
import Who from "./components/Who";
import Works from "./components/Works";
import Contact from "./components/Contact";

const Container = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overflow-y: auto;
  scrollbar-width: none;
  color: white;
  background: url("./img/bg.jpeg") no-repeat center center fixed;
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
  const [role, setRole] = useState(null);

  const handleSelectRole = (selectedRole) => {
    setRole(selectedRole);
    window.location.href = `/chat?role=${selectedRole}`;
  };

  return (
    <Container>
      <Section>
        <Hero />
      </Section>
      <Section>
        <Who role={role} onSelectRole={handleSelectRole} />
      </Section>
      <Section>
        <Works />
      </Section>
      <Section>
        <Contact />
      </Section>
    </Container>
  );
}

export default Home;