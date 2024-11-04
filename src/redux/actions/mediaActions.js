// src/redux/actions/mediaActions.js

import axiosInstance from '../../axiosInstance'; // Import the configured Axios instance
import { FETCH_MEDIA,UPLOAD_MEDIA,UPDATE_SHARE_COUNT,INCREMENT_VIEW_COUNT } from './types'; // Import action types

export const fetchMedia = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get('/files'); // Adjust URL
    dispatch({ type: FETCH_MEDIA, payload: response.data.data });
  } catch (error) {
    console.error('Fetch media error:', error);
  }
};

// Action to upload media
export const uploadMedia = (formData) => async (dispatch) => {
  try {
    const response = await axiosInstance.post('/files/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);
        dispatch({ type: UPLOAD_MEDIA, payload: percent }); // Dispatch upload progress
      },
    });

    dispatch(fetchMedia()); // Fetch media after upload
    return response.data; // Return response data
  } catch (error) {
    console.error('Upload media error:', error);
    throw error; // Propagate error to handle in component
  }
};

// Update share count action
export const updateShareCount = (mediaId) => async (dispatch) => {
  try {
    const response = await axiosInstance.post(`/files/${mediaId}/share`);
    
    // Destructure the necessary data from the response
    const { mediaItem } = response.data; // Assuming mediaItem contains shareCount and link

    const updatedShareCount = mediaItem.shareCount;
    const link = mediaItem.link; // Get the link from the mediaItem object

    // Dispatch the action with the updated media item
    dispatch({ 
      type: UPDATE_SHARE_COUNT, 
      payload: { 
        updatedShareCount, 
        link 
      } 
    });

    // Return the updated share count and link as an object
    return { updatedShareCount, link }; 
  } catch (error) {
    console.error('Error updating share count:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};

export const incrementViewCount = (mediaId) => async (dispatch) => {
  try {
    const response = await axiosInstance.post(`/files/${mediaId}/views`);
    const viewCount = response.data.views;

    dispatch({ type: INCREMENT_VIEW_COUNT, payload: { mediaId, viewCount: response.data.viewCount } });
    return viewCount;
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
};