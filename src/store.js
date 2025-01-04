import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk'; 
import productsReducer from "./slices/productsSlice.js";
import productReducer from './slices/productSlice.js';
import authReducer from './slices/authSlice.js';
import cartReducer from './slices/cartSlice.js';
import orderReducer from './slices/orderSlice.js';
import userReducer from './slices/userSlice.js'

const reducer = combineReducers({
  productsState: productsReducer,//many product
  productState: productReducer, // single product
  authState:authReducer,// user authorization
  cartState:cartReducer,
  orderState:orderReducer,
  userState:userReducer
});

const store = configureStore({
  reducer,
  //middleware:[thunk]
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk) 
});

export default store;




