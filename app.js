const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const orderRoutes = require('./src/routes/orderRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());

app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
