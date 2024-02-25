const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const moment = require('moment');

router.post(
    '/',
    // Checking that username and password are correct
    body('username').isLength({ min: 3 }).trim().escape(),
    body('password').isLength({ min: 5 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(420).json({ errors: 'Conditions are not fulfilled' });
      }
  
      try {
        // Checking if the username already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
          return res.status(421).json({ username: 'Username already in use.' });
        }
  
        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        // Creating a new user
        const newUser = new User({
          username: req.body.username,
          name: req.body.name,
          password: hash,
          registerDate: moment(Date.now()).format('DD-MM-YYYY')
        });
  
        // Saving the new user to the database
        await newUser.save();
  
        res.status(201).json({ message: 'User registered successfully!' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  );


module.exports = router;