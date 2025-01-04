const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error.js')
require('dotenv').config({path:__dirname+'/.env'});
const cookieParser = require('cookie-parser')


app.use(express.json());
app.use(cookieParser())
const productRoutes = require('./routes/product');
const auth = require('./routes/auth');
const order=require('./routes/order.js')
const payment=require('./routes/payment.js')
const path=require('path')
const dotenv=require('dotenv').config();


app.use(express.json());
app.use('/api/v1', productRoutes);
app.use('/api/v1', auth);
app.use('/api/v1',order);
app.use('/api/v1/',payment)
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/build'))) ;
    app.get('*',(req,res) =>{
        res.sendFile(path.resolve(__dirname,'../frontend/build/index.html'))
    })
}


app.use(errorMiddleware);

module.exports = app;



