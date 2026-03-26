import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// KHÔNG import BrowserRouter ở đây nếu đã có ở App.js

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);