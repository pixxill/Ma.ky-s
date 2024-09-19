import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css'; // Import global styles if needed

// Get the root container element
const container = document.getElementById('root');
const root = createRoot(container);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
