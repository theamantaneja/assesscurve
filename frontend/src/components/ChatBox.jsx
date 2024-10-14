import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from './axiosConfig';
import ReactMarkdown from 'react-markdown';
import './style.css';
import { UserContext } from '../context/UserContext';
import PdfUpload from './PdfUpload';

const ChatBox = () => {
  const { isLoggedIn, role, userId } = useContext(UserContext);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPdfUpload, setShowPdfUpload] = useState(false);

  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    const loadInitialMessage = async () => {
      if (!role || !userId) {
        console.error('Missing role or userId; unable to start chat session.');
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'bot', text: 'Failed to load user data. Please make sure you are logged in.' }
        ]);
        return;
      }

      try {
        const response = await axios.post('/api/chat/further', { message: "", role, userId });
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'bot', text: response.data.reply }
        ]);
      } catch (error) {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'bot', text: 'Failed to load initial content. Please try again.' }
        ]);
      }
    };

    if (isLoggedIn && role && userId) {
      loadInitialMessage();
    }
  }, [role, userId, isLoggedIn]);

  const handleSend = async () => {
    if (message.trim() === '' || isProcessing) {
      return;
    }

    setChatHistory((prevHistory) => [
      ...prevHistory,
      { type: 'user', text: message }
    ]);

    setIsProcessing(true);

    try {
      const response = await axios.post('/api/chat/further', { message, role, userId });
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'bot', text: response.data.reply }
      ]);
    } catch (error) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'bot', text: 'An error occurred while processing your request. Please try again.' }
      ]);
    } finally {
      setMessage('');
      setIsProcessing(false);
    }
  };

  return (
    <div className="chat-container">
      <div ref={chatHistoryRef} className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.type}`}>
            <ReactMarkdown>{chat.text}</ReactMarkdown>
          </div>
        ))}
      </div>

      {/* Conditionally render the PdfUpload tool for teachers */}
      {role === 'teacher' && (
        <div className="my-4">
          {/* Tailwind-enhanced button */}
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 ease-in-out"
            onClick={() => setShowPdfUpload(!showPdfUpload)}
          >
            {showPdfUpload ? 'Hide' : 'Open'} AssessCurve Evaluation Tool
          </button>

          {/* Conditionally render the evaluation component */}
          {showPdfUpload && <PdfUpload />}
        </div>
      )}

      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input-message mb-20"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          disabled={isProcessing}
        />
        <button onClick={handleSend} className="send-button" disabled={isProcessing}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;