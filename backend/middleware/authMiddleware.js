const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/userModel')

exports.authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "no token provided" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select('-password');
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}