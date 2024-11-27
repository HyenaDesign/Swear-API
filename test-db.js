const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Order = require('./src/models/Order');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const testOrder = async () => {
    await connectDB();
    const newOrder = new Order({
        color: 'red',
        size: 42,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '1234567890'
    });
    await newOrder.save();
    console.log('Order saved:', newOrder);
};

testOrder();
