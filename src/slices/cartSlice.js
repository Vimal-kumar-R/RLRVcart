import { createSlice } from "@reduxjs/toolkit";

// A helper function to safely parse JSON
const safeParse = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing JSON", e);
    return null; // Return null if parsing fails
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    // Safely parse localStorage values
    items: safeParse(localStorage.getItem('cartItems')) || [],
    loading: false,
    shippingInfo: safeParse(localStorage.getItem('shippingInfo')) || {},
  },
  reducers: {
    addCartItemRequest(state) {
      state.loading = true;
    },
    addCartItemSuccess(state, action) {
      const item = action.payload;
      const isItemExist = state.items.find(i => i.product === item.product);

      if (isItemExist) {
        state.loading = false; // Item exists, just update loading state
      } else {
        state.items.push(item); // Add new item
        state.loading = false; 
        localStorage.setItem('cartItems', JSON.stringify(state.items)); // Update localStorage
      }
    },
    increaseCartItemQty(state, action) {
      state.items = state.items.map(item => {
        if (item.product === action.payload) {
          item.quantity += 1; // Increment quantity
        }
        return item;
      });
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // Update localStorage
    },
    decreaseCartItemQty(state, action) {
      state.items = state.items.map(item => {
        if (item.product === action.payload && item.quantity > 1) {
          item.quantity -= 1; // Decrement quantity
        }
        return item;
      });
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // Update localStorage
    },
    removeItemFromCart(state, action) {
      const filteredItems = state.items.filter(item => item.product !== action.payload);
      state.items = filteredItems; // Update state
      localStorage.setItem('cartItems', JSON.stringify(state.items)); // Update localStorage
    },
    saveShippingInfo(state, action) {
      state.shippingInfo = action.payload; // Save shipping info
      localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo)); // Update localStorage
    },
    orderCompleted(state) {
      state.items = []; // Clear cart items
      state.loading = false;
      state.shippingInfo = {}; // Clear shipping info
      localStorage.removeItem('shippingInfo'); // Remove from localStorage
      localStorage.removeItem('cartItems'); // Remove from localStorage
      sessionStorage.removeItem('orderInfo'); // Clear session storage
    },
  },
});

// Export actions and reducer
const { actions, reducer } = cartSlice;

export const {
  addCartItemRequest,
  addCartItemSuccess,
  decreaseCartItemQty,
  increaseCartItemQty,
  removeItemFromCart,
  saveShippingInfo,
  orderCompleted,
} = actions;

export default reducer;
