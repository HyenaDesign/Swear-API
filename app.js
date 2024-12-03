const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const orderRoutes = require('./src/routes/orderRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 

dotenv.config();
connectDB();

const app = express();


const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: '*', 
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Luister naar login-verzoeken
    socket.on('login', (data) => {
        const { username, password } = data;

        console.log('Login attempt:', data);

        // Dummy validatie
        if (username === 'admin' && password === 'admin123') {
            socket.emit('loginResponse', { success: true });
        } else {
            socket.emit('loginResponse', { success: false, message: 'Ongeldige inloggegevens.' });
        }
    });

    // Test event
    socket.on('message', (data) => {
        console.log('Message received:', data);
        socket.emit('response', { message: 'Message received on server' });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', (req, res, next) => {
    req.io = io; 
    next();
}, userRoutes);

app.get('/', (req, res) => res.send('CORS and Socket.IO are working'));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
