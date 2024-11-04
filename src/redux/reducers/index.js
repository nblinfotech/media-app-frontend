import { combineReducers } from 'redux';
import mediaReducer from './mediaReducer';

const rootReducer = combineReducers({
  media: mediaReducer,
  // Add other reducers here
});

export default rootReducer;
