
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("Skopje Confidential: Initializing Dossier Engine...");

const container = document.getElementById('root');
if (!container) {
    const msg = "CRITICAL: Could not find root element";
    console.error(msg);
    document.body.innerHTML += `<div style="color:red; font-family:monospace; padding:20px;">${msg}</div>`;
    throw new Error(msg);
}

try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Skopje Confidential: React Render initiated.");
} catch (err) {
    console.error("Skopje Confidential: Render failed", err);
    const errorLog = document.getElementById('error-log');
    if (errorLog) {
        errorLog.innerHTML += `<div>Render Exception: ${err}</div>`;
    }
}
