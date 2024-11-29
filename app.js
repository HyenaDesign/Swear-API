const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const orderRoutes = require('./src/routes/orderRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cors = require('cors');
const http = require('http'); // Import HTTP for server creation
const { Server } = require('socket.io'); // Import Socket.IO

dotenv.config();
connectDB();

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS support
const io = new Server(server, {
    cors: {
        origin: '*', // Replace '*' with your frontend URL for security
        methods: ['GET', 'POST']
    }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Example event handler
    socket.on('message', (data) => {
        console.log('Message received:', data);
        // Emit a response
        socket.emit('response', { message: 'Message received on server' });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', (req, res, next) => {
    req.io = io; // Attach io to the request object if needed in routes
    next();
}, userRoutes);

app.get('/', (req, res) => res.send('CORS and Socket.IO are working'));

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
