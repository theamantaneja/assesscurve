import React from 'react';
import { useLocation } from 'react-router-dom';
import ChatBox from './components/ChatBox';

const Chat = () => {
  const location = useLocation();
  const { role } = location.state || {}; // Defaults to an empty object if location.state is undefined

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatBox role={role} />
    </div>
  );
};

export default Chat;