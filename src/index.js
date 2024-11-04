// src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store'; // Your Redux store
import App from './App';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'font-awesome/css/font-awesome.min.css';
import './assets/css/styles.min.css';


ReactDOM.render(
  <Provider store={store}>
    <App />
    <ToastContainer autoClose={1000}/> {/* Add ToastContainer here */}

  </Provider>,
  document.getElementById('root')
);
