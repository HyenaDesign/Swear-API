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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('Een client verbonden:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client verbroken:', socket.id);
  });
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/v1/orders', (req, res, next) => {
  req.io = io;
  next();
}, orderRoutes);

app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => res.send('API met WebSockets is actief'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server draait op poort ${PORT}`));