import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import for React 18
import { BrowserRouter } from 'react-router-dom'; // Use BrowserRouter instead of unstable_HistoryRouter
import App from './App';
import './index.css';
import { AuthProvider } from './context/authContext';
import { CartProvider } from './context/CartContext'; // <-- Import CartProvider

const container = document.getElementById('root');
const root = createRoot(container); // Create a root

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <CartProvider> 
        <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);