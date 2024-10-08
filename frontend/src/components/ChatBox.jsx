import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from './axiosConfig';  // Your axios configuration file
import ReactMarkdown from 'react-markdown';
import './style.css';  // Custom styling for the chat
import { UserContext } from '../context/UserContext';  // Extract context

const ChatBox = () => {
  const { isLoggedIn, role, userId } = useContext(UserContext);  // Get role and userId from context
  const [message, setMessage] = useState('');  // User input message
  const [chatHistory, setChatHistory] = useState([]);  // Stores chat history 
  const [isProcessing, setIsProcessing] = useState(false);  // Flag for loading state
  const chatHistoryRef = useRef(null);  // Control chat scroll behavior

  // Automatically scroll the chat when new messages are added
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Use POST request to load the initial system-generated message (syllabus/lesson plan)
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
        // POST request without a user message to fetch the initial chat message
        const response = await axios.post('/api/chat/further', { message: "", role, userId });

        // Append the system-generated bot response (syllabus/lesson plan)
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'bot', text: response.data.reply }
        ]);
      } catch (error) {
        console.error('Failed to load initial message:', error);
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'bot', text: 'Failed to load initial content. Please try again.' }
        ]);
      }
    };

    // Only load the initial message if the user is logged in and role/userId are loaded
    if (isLoggedIn && role && userId) {
      loadInitialMessage();
    }
  }, [role, userId, isLoggedIn]);

  // Handle sending further messages after the initial message
  const handleSend = async () => {
    if (message.trim() === '' || isProcessing) {
      return;  // Prevent sending empty messages or spamming while processing
    }

    // Add the user's message to the chat history immediately
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { type: 'user', text: message }
    ]);
    
    setIsProcessing(true);

    try {
      // POST request with the user's message to handle further interactions
      const response = await axios.post('/api/chat/further', { message, role, userId });

      // Append the bot's reply to the chat history
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'bot', text: response.data.reply }
      ]);
    } catch (error) {
      console.error('Error processing user message:', error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'bot', text: 'An error occurred while processing your request. Please try again.' }
      ]);
    } finally {
      setMessage('');  // Clear the input after sending
      setIsProcessing(false);  // Mark processing as done
    }
  };

  return (
    <div className="chat-container">
      {/* Chat history displays conversation */}
      <div ref={chatHistoryRef} className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.type}`}>
            <ReactMarkdown>{chat.text}</ReactMarkdown>  {/* Improve formatting */}
          </div>
        ))}
      </div>

      {/* Input bar for typing messages */}
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}  // Update message field
          className="input-message mb-20"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}  // Send message on Enter key
          placeholder="Type your message..."
          disabled={isProcessing}  // Disable input while processing
        />
        <button onClick={handleSend} className="send-button" disabled={isProcessing}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;