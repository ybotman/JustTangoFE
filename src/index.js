import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log("App is being initialized : Index");


const root = document.getElementById('root');
createRoot(root).render(<App />);
