// src/controllers/authController.js
const User = require('../models/User');
const { generateTokens } = require('../utils/auth');

exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Create user
    const newUser = await User.create({
      email,
      password,
      firstName,
      lastName
    });

    // 3. Generate tokens
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    // 4. Store refresh token in DB
    newUser.refreshToken = refreshToken;
    await newUser.save();

    // 5. Send response (hide password via schema select: false)
    res.status(201).json({
      status: 'success',
      accessToken,
      user: { id: newUser._id, email: newUser.email }
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find user & explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    // 3. Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // 4. Update refresh token in DB (Token Rotation)
    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save();

    res.status(200).json({
      status: 'success',
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email}
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



//refresh token controller
const jwt = require('jsonwebtoken');

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body; // or from a secure cookie

    if (!token) {
      return res.status(401).json({ message: 'Refresh Token is required' });
    }

    // 1. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 2. Find user and check if token matches what's in DB
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' });
    }

    // 3. Generate new pair (Refresh Token Rotation)
    const tokens = generateTokens(user._id);

    // 4. Update DB
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json({
      status: 'success',
      ...tokens
    });
  } catch (err) {
    return res.status(403).json({ message: 'Token verification failed' });
  }
};



//logout
// src/controllers/authController.js
exports.logout = async (req, res) => {
  try {
    // req.user is available because logout IS protected
    await User.findByIdAndUpdate(req.user.id, {
      $unset: { refreshToken: 1 } 
    });

    res.status(200).json({ status: 'success', message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed' });
  }
};