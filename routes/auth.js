const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const validator = require('validator');  // For email validation
require('dotenv').config();

const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all required fields" });
    }

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        
        // Add a success field here
        res.json({ success: true, token, userId: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password" });
    }

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, userId: user.id });
    } catch (err) {
        console.error(err);  // Log the error for debugging
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
