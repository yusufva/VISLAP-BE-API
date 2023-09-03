require('dotenv').config();
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminsRouter = require('./routes/admins')
var kategoriRouter = require('./routes/kategori');
var productRouter = require('./routes/products');
var refreshTokenRouter = require('./routes/refreshToken');
var transactionRouter = require('./routes/transaction');
var cartRouter = require('./routes/cart');
var servicesRouter = require('./routes/service');
var paymentRouter = require('./routes/midtrans');

var app = express();

app.use(cors({origin:function (origin, callback) {console.log(`Origin ${origin} is being granted CORS access`);callback(null, true)}, credentials:true, exposedHeaders:['set-cookie'], methods:'GET, PUT, POST, DELETE, HEAD, OPTIONS'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('./public/images'));

app.use('/', indexRouter);
app.use('/users', usersRouter); //login user
app.use('/token', refreshTokenRouter); //refresh access token
app.use('/admins', adminsRouter); //login admin
app.use('/category', kategoriRouter); //category product
app.use('/products', productRouter); //products
app.use('/txs', transactionRouter); //transactions
app.use('/cart', cartRouter); //cart
app.use('/services', servicesRouter); //services
app.use('/payment', paymentRouter); //payment gateway

module.exports = app;
