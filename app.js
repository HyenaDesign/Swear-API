const connectDB = require("./src/config/db.js");
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const orderRoutes = require('./src/routes/orderRoutes');
app.use('/api/v1/orders', orderRoutes);


dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

connectDB();