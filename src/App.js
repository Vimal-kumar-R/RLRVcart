import './App.css';
import Header from './componentes/layouts/Header.js';
import Footer from './componentes/layouts/Footer.js';
import Home from './componentes/Home.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer, } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ProductDetail from './componentes/product/ProductDetail.js';
import ProductSearch from './componentes/product/ProductSearch.js';
import Login from './componentes/User/Login.js';
import Register from './componentes/User/Register.js';
import { useEffect, useState } from 'react';
import store from './store.js'
import { loadUser } from './actions/userActions.js';
import Profile from './componentes/User/Profile.js';
import ProtectedRoute from './componentes/route/ProtectedRoute.js';
import UpdateProfile from './componentes/User/UpdateProfile.js';
import UpdatePassword from './componentes/User/UpdatePassword.js';
import ForgotPassword from './componentes/User/ForgotPassword.js';
import ResetPassword from './componentes/User/ResetPassword.js';
import Cart from './componentes/Cart/Cart.js';
import Shipping from './componentes/Cart/Shipping.js';
import ConfirmOrder from './componentes/Cart/ConfirmOrder.js';
import Payment from './componentes/Cart/Payment.js';
import axios from 'axios';
import {Elements} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './componentes/Cart/OrderSuccess.js';
import UserOrders from './componentes/order/UserOrders.js';
import OrderDetail from './componentes/order/OrderDetail.js';
import Dashboard from './componentes/admin/Dashboard.js';
import ProductList from './componentes/admin/ProductList.js';
import NewProducts from './componentes/admin/NewProduct.js';
import UpdateProduct from './componentes/admin/UpdateProduct.js';
import OrderList from './componentes/admin/OrderList.js';
import UpdateOrder from './componentes/admin/UpdateOrder.js';
import UserList from './componentes/admin/UserList.js';
import UpdateUser from './componentes/admin/UpdateUser.js';
import ReviewList from './componentes/admin/ReviewList.js';

function App() {
  const [stripeApiKey,setStripeApiKey]=useState("")

 useEffect(()=>{
  store.dispatch(loadUser)
  async function getStripeApiKey(){
    const {data} = await axios.get('/api/v1/stripeapi')
    setStripeApiKey(data.stripeApiKey)
  }
  getStripeApiKey()
 },[])


  return (
    <Router>
      <div className="App">
        <HelmetProvider>

        <Header />
        <div className='container container-fluid'>
        <ToastContainer theme='dark'/>
         <Routes>
           <Route path="/" element={<Home/>} />
           <Route path="/search/:keyword" element={<ProductSearch />} />
           <Route path="/product/:id" element={<ProductDetail/>} />
           <Route path="/login" element={<Login/>}/>
           <Route path='/register'element={<Register/>}/>
           <Route path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
           <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>}/>
           <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>
           <Route path='/password/forgot' element={<ForgotPassword/>}/>
           <Route path='/password/reset/:token' element={<ResetPassword/>}/>
           <Route path='/cart' element={<Cart/>}/>
           <Route path='/shipping' element={<ProtectedRoute><Shipping/></ProtectedRoute>}/>
           <Route path='/order/confirm' element={<ProtectedRoute><ConfirmOrder/></ProtectedRoute>}/>
           <Route path='/order/success' element={<ProtectedRoute><OrderSuccess/></ProtectedRoute>}/>
           <Route path='/orders' element={<ProtectedRoute><UserOrders/></ProtectedRoute>}/>
           <Route path='/order/:id' element={<ProtectedRoute><OrderDetail/></ProtectedRoute>}/>
           {stripeApiKey &&<Route path='/payment' element={<ProtectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProtectedRoute>}/>
           } 
           

         </Routes>
        </div>
         {/* Admin Routes */}
        <Routes>
           <Route path='/admin/dashBoard' element={<ProtectedRoute isAdmin={true}><Dashboard/></ProtectedRoute>}/>
           <Route path='/admin/products' element={<ProtectedRoute isAdmin={true}><ProductList/></ProtectedRoute>}/>
           <Route path='/admin/orders' element={<ProtectedRoute isAdmin={true}><OrderList/></ProtectedRoute>}/>
           <Route path='/admin/users' element={<ProtectedRoute isAdmin={true}><UserList/></ProtectedRoute>}/>
           <Route path='/admin/products/create' element={<ProtectedRoute isAdmin={true}><NewProducts/></ProtectedRoute>}/>
           <Route path='/admin/product/:id' element={<ProtectedRoute isAdmin={true}><UpdateProduct/></ProtectedRoute>}/>
           <Route path='/admin/order/:id' element={<ProtectedRoute isAdmin={true}><UpdateOrder/></ProtectedRoute>}/>
           <Route path='/admin/user/:id' element={<ProtectedRoute isAdmin={true}><UpdateUser/></ProtectedRoute>}/>
           <Route path='/admin/reviews' element={<ProtectedRoute isAdmin={true}><ReviewList/></ProtectedRoute>}/>
        </Routes>
        <Footer />

        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;

