const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Chats = require('../models/Chats');
const validateToken = require('../auth/validateToken');
const { body, validationResult } = require('express-validator');

// Route to fetch user data based on username
router.get('/' ,validateToken ,async (req, res) => {
  const { username } = req.query;

  try {
    // Find user by username in the database
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Route to get all users
router.get('/all', validateToken, async (req, res) => {
  const { username } = req.query;

  try {
    // Find all users in the database except the currently logged-in user
    const users = await User.find({ username: { $ne: username } });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to update or add bio for user
router.put('/edit', validateToken, [
  body('bio').isLength({ max: 150 }).withMessage('Bio cannot exceed 150 characters'), // Validate bio length
], async (req, res) => {
  const bio = req.body.bio;
  const { username } = req.query;

  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find user by username in the database and update bio
    const user = await User.findOneAndUpdate({ username }, { bio }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route which handles likes and matches.
router.put('/like', validateToken, async (req, res) => {

  const { liked } = req.query;

  try {

    // Find the user being liked
    const likedUser = await User.findOne({username: liked});

    if (!likedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the user doing the liking
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Check if the users have already liked each other
    const isMatch = likedUser.likes.some(
      (likedUsername) => likedUsername.toString() === user.username
    );

    if (isMatch) {
      // If they have liked each other, add them to the matches array of both users
      await User.updateOne(
        { username: liked },
        { $addToSet: { matches: user.username } }
      );
      await User.updateOne(
        { username: user.username },
        { $addToSet: { matches: likedUser.username } }
      );
      // Creating new chat schema for users if matched.
      const newChat = new Chats({
        username: user.username,
        matchUsername: likedUser.username,
        messages: []
      });

      await newChat.save();

    } else {
      // If they haven't liked each other, add the liked user to the likes field of current user.
      await User.updateOne(
        { username: user.username },
        { $addToSet: { likes: liked } }
      );
    }
    if (isMatch) {
      // If the user being liked is already in the likes array, it means they have already liked each other and it's a match
      return res.status(200).json({ isMatch });
    }

    return res.status(200).json({ isMatch });
  } catch (error) {
    console.error('Error liking user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


