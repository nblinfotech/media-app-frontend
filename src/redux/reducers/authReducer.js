// authReducer.js
import { LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_SUCCESS, LOGOUT } from '../actions/types';

const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState = {
  isAuthenticated: !!token,
  user: storedUser ? JSON.parse(storedUser) : null, // Parse user data if it exists
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { token, user } = action.payload.data;
      localStorage.setItem('token', token); // Store token in localStorage
      localStorage.setItem('user', JSON.stringify(user)); // Store user data in localStorage
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return initialState;
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authReducer;
