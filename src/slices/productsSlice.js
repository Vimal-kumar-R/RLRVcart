
import { createSlice } from "@reduxjs/toolkit";



const productsSlice = createSlice({
    name: 'products',
    initialState: {
        loading: false,
        products: [],
        productsCount: 0,  // Initialize productsCount in the state
        resPerPage: 0,
        error: null
    },
    reducers: {
        productsRequest(state) {
            state.loading = true;
            state.error = null;  // Clear any previous error
        },
        productsSuccess(state, action) {
            state.loading = false;
            state.products = action.payload.products;
            state.productsCount = action.payload.productsCount;  // Update productsCount
            state.resPerPage = action.payload.resPerPage;
        },
        productsFail(state, action) {
            state.loading = false;
            state.error = action.payload;  // Set the error message
        },
        adminProductsRequest(state,action){
            return{
                loading:true
            }
        },
        adminProductsSuccess(state,action){
            return{
                loading:false,
                products:action.payload.products,
            }
        },
        adminProductsFail(state,action){
            return{
                loading:false,
                error:action.payload
            }
        },
        clearError(state,action){
            return{
                ...state,
                error:null
            }
        }
    }
});

export const { productsRequest, productsSuccess, productsFail,adminProductsRequest,adminProductsSuccess,adminProductsFail,clearError} = productsSlice.actions;
export default productsSlice.reducer;
