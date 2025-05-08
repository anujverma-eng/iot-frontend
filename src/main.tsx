// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { store } from './store';
import AuthBootstrap from './lib/auth/AuthBootstrap';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AuthBootstrap />
    <App />
  </Provider>,
);
