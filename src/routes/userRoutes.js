const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Ontvangen wachtwoord:', password); // Log the password you receive

        const user = await User.findOne({ username });
        if (!user) {
            console.log('Gebruiker niet gevonden'); // Log when the user is not found
            return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Vergelijking wachtwoord:', isMatch); // Log the password comparison result

        if (!isMatch) {
            return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        req.io.emit('loginEvent', { user: username, message: 'User logged in successfully' });

        res.status(200).json({ status: 'success', data: { token } });
    } catch (error) {
        console.error('Login error:', error); // Log the error if something goes wrong
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
