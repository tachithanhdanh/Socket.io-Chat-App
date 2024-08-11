import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap css

// Render the app through add a root element to the DOM
ReactDOM.createRoot(document.getElementById('root')!).render(
  // Wrap the app with the BrowserRouter to enable routing
  // BrowserRouter is a component that provides the routing functionality to the app
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)