const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: { 
    type: String, 
    required: true 
  },
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  picture: {
    type: String,
  },
  registerDate: {
    type: String,
  },
  likes: [
    {
      type: String,
    },
  ],
  matches: [
    {
      type: String,
    },
  ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
