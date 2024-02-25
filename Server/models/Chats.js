const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const ChatSchema = new mongoose.Schema({
  username: { type: String, required: true },
  matchUsername: { type: String, required: true },
  messages: [
    {
      senderId: { type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: String, required: true},
    },
  ],
});

const Chats = mongoose.model('Chats', ChatSchema);

module.exports = Chats;