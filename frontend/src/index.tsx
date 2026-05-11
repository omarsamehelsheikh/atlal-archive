import React from 'react';
import ReactDOM from 'react-dom/client';

// @ts-ignore
// This ignore is needed because TypeScript 5+ sometimes requires 
// specific declarations for non-code assets like CSS.
import './index.css';

import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure index.html has <div id='root'></div>");
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);