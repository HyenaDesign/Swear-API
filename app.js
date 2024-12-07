const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const app = express();

// Middleware voor JSON parsing
app.use(express.json());

// Verbinden met de MongoDB-database
mongoose.connect('mongodb://localhost:27017/yourdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Stel HTTP server in en koppel Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Maak een eenvoudige WebSocket-verbinding
io.on('connection', (socket) => {
    console.log('Nieuwe WebSocket verbinding:', socket.id);
    socket.on('disconnect', () => {
        console.log('WebSocket verbinding gesloten:', socket.id);
    });
});

// Geef de io aan de routes door voor gebruik bij event-emitting
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Gebruik de user-routes voor login
app.use('/api/users', userRoutes);

// Start de server
server.listen(5000, () => {
    console.log('Server draait op http://localhost:5000');
});