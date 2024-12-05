const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// POST endpoint to create an order
router.post('/orders', async (req, res) => {
    const { color, material, size, status } = req.body;

    try {
        const newOrder = await Order.create({ color, material, size, status });
        res.status(201).json({ status: 'success', data: newOrder });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
});

module.exports = router;
