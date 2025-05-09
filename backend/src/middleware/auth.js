import jwt from 'jsonwebtoken';
import config from '../config/default.js';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
    let token;

    // Check if token exists in header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            console.log("ram ram");
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }
};
