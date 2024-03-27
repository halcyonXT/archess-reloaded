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
const socketio = require('socket.io');

// ! USED FOR PACKET MESSAGE WITH "L" PREFIX PARSING
const jsChessEngine = require('js-chess-engine')
const { aiMove } = jsChessEngine


const cookieParser = require("cookie-parser")
const colors = require('colors');
const connectDB = require('./src/config/database.js');


const log = (type, rmsg) => {
    if (!rmsg) return;
    let msg = String(rmsg);

    if (typeof msg !== 'string') {
        log("err", "Unable to log: " + typeof msg);
    }
    switch (type) {
        case "suc":
        case "success":
            console.log(msg.green.bold);
            break
        case "err":
        case "error":
            console.log(msg.red.bold);
            break
        default:
            console.log(msg.blue.bold);
            break
    }
}

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

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

const PORT = 8080;

server.listen(PORT, () => console.log(`[success] Server running on port ${PORT}`.green.bold));

const buildSocketMessage = (message, status, data) => {
    return ({
        message,
        status,
        data
    })
}

const moveFetcher = async (fen, rawDepth) => {
    let depth = rawDepth;

    // ! replace continuation from stockfish packet with js-chess-engine one. will provide all info from api except its bestmove
    let replaceCont = null;

    const getLPrefixMove = async (depth) => {
        let nd = String(depth).charAt(0) === "L" ? String(depth).slice(-1) : depth;
        return aiMove(fen, nd);
    }

    if ((String(depth)).charAt(0) === "L") {
        let raw = await getLPrefixMove(depth);

        if (typeof raw !== 'object') {
            return buildSocketMessage(
                "js-chess-engine error",
                "error",
                ({})
            )
        }

        let key = Object.keys(raw)[0];
        replaceCont = `${key}${raw[key]}`.toLowerCase();
        depth = (String(depth)).slice(-1);
    }

    const apiUrl = 'https://stockfish.online/api/s/v2.php';
    const params = {
        fen,
        depth
    };
    

    const queryString = new URLSearchParams(params).toString();
    const url = `${apiUrl}?${queryString}`;

    let raw = await fetch(url);

    if (!raw.ok) {
        return buildSocketMessage(
            "Failure, retrying in 3s",
            "error",
            ({})
        )
    }

    let processed = await raw.json();

    if (replaceCont) {
        processed.continuation = replaceCont;
    }

    //log("success", processed.continuation)

    if (!(processed?.success)) {
        return buildSocketMessage(
            "API failure",
            "error",
            ({})
        )
    }

    return buildSocketMessage(
        "",
        "success",
        processed
    )
        
}


const users = {};

io.on('connection', socket => {
    log("inf", "New WS connection");

    users[socket.id] = {};


    socket.on('getMove', async (options) => {
        let socketMessage = await moveFetcher(options.fen, options.depth);
        //log("inf", "Move made: " + socketMessage.status)
        io.to(socket.id).emit("retrieveMove", socketMessage);
    })

    socket.on('disconnect', () => {
        delete users[socket.id];
        log("err", "Disconnected - " + users[socket.id])
    })
})

