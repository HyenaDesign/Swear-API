const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check for admin credentials
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.io.emit('loginEvent', { user: username, message: 'Admin logged in successfully' });
            return res.status(200).json({ status: 'success', data: { token } });
        }

        // Check in the database for regular users
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.io.emit('loginEvent', { user: username, message: 'User logged in successfully' });
        res.status(200).json({ status: 'success', data: { token } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


module.exports = router;