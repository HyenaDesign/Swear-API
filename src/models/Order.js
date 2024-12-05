const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    color: { type: String, required: true },
    material: { type: String, required: true },
    size: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
