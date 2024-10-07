import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const RoleContainer = styled.div`
  text-align: center;
  color: white;
  margin-top: 50px; /* Adjust this margin to position it correctly */
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
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    navigate('/chat', { state: { role } });
  };

  return (
    <RoleContainer>
      <Title>Hello! Are you a student or a teacher?</Title>
      <Button onClick={() => handleSelectRole('student')}>Student</Button>
      <Button onClick={() => handleSelectRole('teacher')}>Teacher</Button>
    </RoleContainer>
  );
};

export default RoleSelection;