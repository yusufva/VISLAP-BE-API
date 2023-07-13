require('dotenv').config();
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminsRouter = require('./routes/admins')
var kategoriRouter = require('./routes/kategori')
var productRouter = require('./routes/products')
var refreshTokenRouter = require('./routes/refreshToken')

var app = express();

app.use(cors())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/token', refreshTokenRouter);
app.use('/admins', adminsRouter)
app.use('/category', kategoriRouter)
app.use('/products', productRouter)

module.exports = app;
