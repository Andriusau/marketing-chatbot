import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // We'll assume this exists for Tailwind styles and other stuff AA

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

