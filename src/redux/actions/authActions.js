import axiosInstance from '../../axiosInstance'; // Import the configured Axios instance
import { LOGIN_SUCCESS, LOGIN_FAIL, REGISTER_SUCCESS, REGISTER_FAIL, LOGOUT } from './types';

// Action for logging in a user
export const loginUser = (formData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/login', formData);
    console.log('Login Response:', response); // Log the response for debugging
    const token = response.data.data.token; // Assuming the token is in the response

    localStorage.setItem('token', token); // Store the token in local storage

    dispatch({ type: LOGIN_SUCCESS, payload: response.data });
    return response; // Return the response to the component
  } catch (error) {
    console.error('Login Error:', error.response); // Log the error response for debugging
    dispatch({ type: LOGIN_FAIL, payload: error.response.data });
    return error.response; // Return the error response to the component
  }
};

// Action for registering a user
export const registerUser = (formData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/auth/register', formData);
    console.log('Registration Response:', response); // Log the response for debugging

    dispatch({ type: REGISTER_SUCCESS, payload: response.data });
    return response; // Return the response to the component
  } catch (error) {
    console.error('Registration Error:', error.response); // Log the error response for debugging
    dispatch({ type: REGISTER_FAIL, payload: error.response.data });
    return error.response; // Return the error response to the component
  }
};

// Action to logout a user
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token'); // Remove the token from local storage
  dispatch({ type: LOGOUT }); // Dispatch logout action
};
