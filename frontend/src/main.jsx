import React from 'react';
import ReactDOM from 'react-dom/client';  // `createRoot` is imported from 'react-dom/client'
import App from './App';
import { UserProvider } from './context/UserContext.jsx';

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));  // Use createRoot in React 18

root.render(
  <UserProvider>   {/* Wrap your entire app with UserProvider for global context */}
    <App />        {/* Render the app */}
  </UserProvider>
);