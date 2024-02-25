const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validateToken = require("../auth/validateToken");

router.post('/', 
  body('username').isLength({ min: 3 }).trim().escape(),
  body('password').isLength({ min: 5 }).escape(),
  async (req, res, next) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      
      if (!user) {
        return res.status(420).json({ message: 'Login failed!' });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);
      // Making jwtToken to verify users.
      if (isMatch) {
        const jwtPayload = {
          id: user._id,
          username: user.username
        }
        jwt.sign(
          jwtPayload,
          process.env.SECRET,
          {
            expiresIn: 120
          },
          (err, token) => {
            res.json({success: true, token});
          }
        );
      } else {
        res.status(421).json({ message: 'Login failed!' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

module.exports = router;