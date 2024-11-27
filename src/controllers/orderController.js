const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json({ status: 'success', data: order });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({ status: 'success', data: orders });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
