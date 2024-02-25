const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Chats = require('../models/Chats');
const validateToken = require('../auth/validateToken');
const moment = require('moment');

router.get('/', validateToken, async (req, res) => {
    const {username} = req.query

    try {

        const userChats = await Chats.aggregate([
        {
            $match: {
            $or: [
                { username: username },
                { matchUsername: username },
            ],
            },
        },
        ]);
        // Return all chats user has
        res.status(200).json(userChats);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

});
// Route which gets specific chat user has whith other user.
router.get('/chat', validateToken, async (req, res) => {

    const {id} = req.query

    try {

        const chat = await Chats.findOne({
            _id: id,
          });
        // return message from the chat.
        res.status(200).json(chat.messages);

    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

});
// Route which handles sent messages
router.post('/send', validateToken, async (req, res) => {

    const {id} = req.query
    const username = req.body.username
    const content = req.body.text
    try {
        // Find the chat between the sender and recipient
        const chat = await Chats.findOne({
          _id: id,
        });
        if (!chat) {
          // If there's no chat between the sender and recipient, return an error
          res.status(400).json({ message: 'Error finding chat' });
        } else {
          // If there is chat between the sender and recipient, add the message to it
          chat.messages.push({
            senderId: username,
            content: content,
            timestamp: moment(Date.now()).format('DD-MM-YYYY HH:mm'),
          });
    
          await chat.save();
    
          res.status(201).json(chat);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
});


module.exports = router;


