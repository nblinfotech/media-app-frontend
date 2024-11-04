// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MediaList from './components/MediaList';
import Auth from './components/Auth';
import AuthNew from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from './redux/actions/authActions';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleLogin = (email) => {
    // Simulate login success with user email
    dispatch(loginUser(email));
  };

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Auth onLogin={handleLogin} />} />

          <Route
            path="/media-list"
            element={
              <ProtectedRoute isLoggedIn={isAuthenticated}>
                <MediaList />
              </ProtectedRoute>
            }
          />
        </Routes>
    </Router>
  );
};

export default App;
