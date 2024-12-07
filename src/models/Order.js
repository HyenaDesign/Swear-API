const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    size: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    // Components object containing each component's color and material
    components: {
        laces: {
            color: { type: String, required: true },
            material: { type: String, required: true } // Storing the material as a string identifier
        },
        sole: {
            color: { type: String, required: true },
            material: { type: String, required: true } // Storing the material as a string identifier
        },
        inside: {
            color: { type: String, required: true },
            material: { type: String, required: true } // Storing the material as a string identifier
        },
        outside: {
            part1: {
                color: { type: String, required: true },
                material: { type: String, required: true } // Storing the material as a string identifier
            },
            part2: {
                color: { type: String, required: true },
                material: { type: String, required: true } // Storing the material as a string identifier
            },
            part3: {
                color: { type: String, required: true },
                material: { type: String, required: true } // Storing the material as a string identifier
            }
        }
    }
});

module.exports = mongoose.model('Order', orderSchema);