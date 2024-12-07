const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Zoek de gebruiker in de database
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
        }

        // Maak een JWT-token aan voor de gebruiker
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Emit een login event via WebSocket naar alle verbonden clients
        req.io.emit('loginEvent', { user: username, message: 'User logged in successfully' });

        // Stuur het token naar de frontend
        res.status(200).json({ status: 'success', data: { token } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;