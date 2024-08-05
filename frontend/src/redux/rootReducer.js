import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import accountReducer from './slices/accountSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  account: accountReducer,
});

export default rootReducer;
