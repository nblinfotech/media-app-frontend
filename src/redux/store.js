// src/redux/store.js

import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Ensure you have this correct
import authReducer from './reducers/authReducer';
import mediaReducer from './reducers/mediaReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  media: mediaReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
