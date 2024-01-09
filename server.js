// ! EXPRESS
const express = require('express');
const { json, urlencoded } = express
const router = express.Router()

// ! CrossOriginResourceSharing HANDLING
const cors = require('cors');

// ! .env
require('dotenv').config()

// ! HTTP
const http = require('http');

// ! SOCKET
const socketio = require('socket.io');


const cookieParser = require("cookie-parser")
const connectDB = require('./src/config/database.js')
const colors = require('colors');

const app = express();

app.use(cors({ 
    credentials: true,
    origin: "http://localhost:5173"
}));
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser());

const server = http.createServer(app)
connectDB()

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

const PORT = 8080;

server.listen(PORT, () => console.log(`[success] Server running on port ${PORT}`.green.bold));