
// * EXPRESS
const express = require('express');
const { json, urlencoded } = express
const router = express.Router()
//const expressValidator = require('express-validator');

// * CrossOriginResourceSharing HANDLING
const cors = require('cors');

// * .env
require('dotenv').config()

// * HTTP
const http = require('http');

// * SOCKET
// const socketio = require('socket.io')


// ! USED FOR PACKET MESSAGE WITH "L" PREFIX PARSING
const jsChessEngine = require('js-chess-engine')
const { aiMove } = jsChessEngine


const cookieParser = require("cookie-parser")
const colors = require('colors');
const connectDB = require('./src/config/database.js');


const { log } = require('./log.js')

Array.prototype.removeElementFromArray = function(element) {
    const index = this.indexOf(element);
    if (index !== -1) {
        this.splice(index, 1);
        return true; // Element removed successfully
    }
    return false; // Element not found in the array
};

const app = express();

// app.use(cors({
//     credentials: true,
//     origin: "http://localhost:5173"
// }));
app.use(cors({origin: true, credentials: true}));
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser());

const userRoutes = require('./routes/user')
app.use("/", userRoutes)




const server = http.createServer(app);

if (process.env.DB_CONNECT === "true") {
    connectDB();
}

const PORT = 8080;

server.listen(PORT, () => console.log(`[success] Server running on port ${PORT}`.green.bold));

const initializeSocket = require('./socket/initializeSocket.js')

initializeSocket(server);

/*setInterval(() => {
    for (let key of Object.keys(socketTrackActions)) {
        console.log(key + " : " + socketTrackActions[key].roomsCreated)
    }
    for (let key of Object.keys(users)) {
        console.log(key + " : " + users[key]['url-init'])
    }
}, 1000)*/

