import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Ensure this path is correct and Tailwind is imported here
import App from './App';

// Create the root element using React 18's createRoot API
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);