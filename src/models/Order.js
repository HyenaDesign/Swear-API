const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    size: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    // Components object containing each component's color and material
    components: {
        laces: {
            color: { type: String, required: true },
            material: { type: String, required: true }
        },
        sole: {
            color: { type: String, required: true },
            material: { type: String, required: true }
        },
        inside: {
            color: { type: String, required: true },
            material: { type: String, required: true }
        },
        outside: {
            part1: {
                color: { type: String, required: true },
                material: { type: String, required: true }
            },
            part2: {
                color: { type: String, required: true },
                material: { type: String, required: true }
            },
            part3: {
                color: { type: String, required: true },
                material: { type: String, required: true }
            }
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);
