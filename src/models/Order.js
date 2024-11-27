const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    color: String,
    size: Number,
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
