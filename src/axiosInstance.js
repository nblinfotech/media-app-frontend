import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Set your base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem('token');

    // If the token exists, set it in the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Return the modified config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Return the response as is
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to token expiration (status code 401)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token if you have a refresh token endpoint
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, { refreshToken });

        const { token } = response.data; // Assuming the new token comes back in this field
        localStorage.setItem('token', token); // Update the token in local storage
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set the new token in the header

        return axios(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        console.error('Token refresh error:', refreshError);
        // Optionally log the user out if token refresh fails
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError); // Reject the promise
      }
    }

    // If the error is not due to an expired token, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
