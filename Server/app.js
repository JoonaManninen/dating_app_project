// app.js
require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/Database');
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB error"));

// Routes
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const usersRoute = require('./routes/users')
const chatRoute = require('./routes/chatRoute')


app.use('/login', loginRoute);
app.use('/register', registerRoute);
app.use('/users', usersRoute);
app.use('/users/edit', usersRoute);
app.use('/users/all', usersRoute);
app.use('/like', usersRoute);
app.use('/messages', chatRoute);
app.use('/messages/chat', chatRoute);
app.use('/messages/send', chatRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
