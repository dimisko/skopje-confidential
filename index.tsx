
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Skopje Confidential: Initializing Dossier Engine...");

const container = document.getElementById('root');

if (container) {
    try {
        const root = createRoot(container);
        root.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>
        );
        console.log("Skopje Confidential: Handshake successful.");
    } catch (err) {
        console.error("Skopje Confidential: Initialization failed", err);
        const log = document.getElementById('error-log');
        if (log) log.innerHTML += `<div>RENDER ERROR: ${err.message}</div>`;
    }
} else {
    console.error("Skopje Confidential: Root container missing from DOM.");
}
