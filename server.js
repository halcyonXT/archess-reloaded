
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
const socketio = require('socket.io')


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


const io = socketio(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});



const USER_DEFAULTS = () => ({
    _ip: null,
    _id: null,
    'url-init': null
})

const IP_TRACK_DEFAULTS = () => ({
    socketConnections: 0,
    roomsCreated: []
})

const SOCKET_TRACK_DEFAULTS = () => ({
    roomsCreated: []
})

const ROOM_DEFAULTS = () => ({
    _TTL_timer: null,
    _queue: [],
    started: false,
    white: null,
    black: null,
})

const users = {};
const gameRooms = {};
const ipTrackActions = {};
const socketTrackActions = {};
const quickMatchQueue = {};

const LOCALHOST_LOOPBACK = "::1";

io.on('connection', socket => {
    log("inf", "New WS connection");

    
    //console.log(clientIP) // is loopback

    const killRoom = (roomID, socketReq = false) => {
        if (socketReq || ipTrackActions[clientIP]?.roomsCreated.includes(roomID)) {
            if (!gameRooms[roomID]) return;

            delete gameRooms[roomID];

            if (!socketReq) {
                socketTrackActions[socket.id]?.roomsCreated?.removeElementFromArray(roomID);
                ipTrackActions[clientIP]?.roomsCreated?.removeElementFromArray(roomID);
            }

            log("error", "Just killed room " + roomID)
            // TODO - Inform all subscriptions the room is dead
        }
    }

    const initiateRoomGame = (roomID) => {
        if (!gameRooms[roomID]) return;

        const START_GAME_EVENT_NAME = "game-begin";

        let isInitiatorWhite = Math.random() > 0.5;

        gameRooms[roomID].started = true;

        io.to(gameRooms[roomID]._queue[0]).emit(START_GAME_EVENT_NAME, ({
            isWhite: isInitiatorWhite,
            gameRoomID: roomID
        }))

        io.to(gameRooms[roomID]._queue[1]).emit(START_GAME_EVENT_NAME, ({
            isWhite: !isInitiatorWhite,
            gameRoomID: roomID
        }))
    }


    users[socket.id] = {...USER_DEFAULTS()};
    const clientIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    users[socket.id]._ip = clientIP;

    if (!ipTrackActions[clientIP]) {
        ipTrackActions[clientIP] = {...IP_TRACK_DEFAULTS()};
    } else {
        ipTrackActions[clientIP].socketConnections++;
    }

    socketTrackActions[socket.id] = {...SOCKET_TRACK_DEFAULTS()};


    // * will recieve url pathname, used for joining channels
    socket.on('client-init', info => {

        if (users[socket.id]) {
            let urlParams = info.url.split('/');

            if (!urlParams[0]) {
                urlParams.shift()
            }

            if (urlParams.length === 0) return;

            switch (urlParams[0]) {
                case "room":
                    // * If the game room was created previously by socket, join the user to the channel
                    if (gameRooms[urlParams[1]]) {
                        // TODO - perform rest of the neccessary checks to determine if client is joining as a spectator or as a player
                        socket.join(urlParams[1]);
                        log("success", "A client just joined existing room " + urlParams[1]);

                        if (gameRooms[urlParams[1]]._queue.length < 2) {
                            gameRooms[urlParams[1]]._queue.push(socket.id);
                            initiateRoomGame(urlParams[1]);
                        }

                        users[socket.id]['url-init'] = info.url;
                    } else {
                        log("err", "A client tried joining fake room " + urlParams[1])
                    }
                    break
            }

        }
    });

    socket.on('play-move', info => {
        const getPlayerIndex = () => gameRooms[info.gameRoomID]?._queue.findIndex(sid => sid == socket.id);
        const getOtherIndex = (ind) => ind === 0 ? 1 : 0;

        let playerIndex = getPlayerIndex(info.gameRoomID);

        if ((playerIndex === -1) || (typeof playerIndex !== 'number')) return;

        let otherIndex = getOtherIndex(playerIndex);

        // console.log(gameRooms[info.gameRoomID]._queue[otherIndex]);
        // console.log("from: " + socket.id);
        io.to(gameRooms[info.gameRoomID]._queue[otherIndex]).emit("opponent-move", ({
            move: info.move
        }))
    })

    socket.on('kill-room', info => {
        killRoom(info.gameRoomID)
    })

    socket.on('create-room', info => {
        let clientIP = users[socket.id]._ip;
        const RESPONSE_EVENT_NAME = "approve-room";
        const TTL_EXPIRED_EVENT_NAME = "vacate-room";

        if (ipTrackActions[clientIP].roomsCreated.length < 4) {
            gameRooms[info.gameRoomID] = {...ROOM_DEFAULTS()};
            gameRooms[info.gameRoomID]._queue.push(socket.id);

            gameRooms[info.gameRoomID]._TTL_timer = setTimeout(() => {
                // TODO - perform checks that will kill the room if nobody joins
                if (!gameRooms[info.gameRoomID]?.started) {
                    killRoom(info.gameRoomID, true);
                }
            }, 600000); // 10 minutes

            ipTrackActions[clientIP].roomsCreated.push(info.gameRoomID);

            socketTrackActions[socket.id].roomsCreated.push(info.gameRoomID);

            socket.join(info.gameRoomID);

            log("succ", socket.id + "client just created a room " + info.gameRoomID);

            let socketMessage = buildSocketMessage("Room created successfully", "success", info.gameRoomID);
            io.to(socket.id).emit(RESPONSE_EVENT_NAME, socketMessage);

        } else {
            let socketMessage = buildSocketMessage("Too many rooms created", "error", "");
            io.to(socket.id).emit(RESPONSE_EVENT_NAME, socketMessage);
        }
    })

    socket.on('getMove', async (options) => {
        let socketMessage = await moveFetcher(options.fen, options.depth);
        
        io.to(socket.id).emit("retrieveMove", socketMessage);
    })

    socket.on('disconnect', () => {
        let clientIP = users[socket.id]._ip;
        delete users[socket.id];
        
        if (socketTrackActions[socket.id]) {
            for (let room of socketTrackActions[socket.id]?.roomsCreated) {
                log("err", "Disconnection killing room " + room);
                killRoom(room);
            }
        }

        delete socketTrackActions[socket.id];
        if (ipTrackActions[clientIP]) {
            ipTrackActions[clientIP].socketConnections -= 1;
            if (ipTrackActions[clientIP].socketConnections === 0) {
                delete ipTrackActions[clientIP];
            }
        }
        log("err", "Disconnected")
    })
})


/*setInterval(() => {
    for (let key of Object.keys(socketTrackActions)) {
        console.log(key + " : " + socketTrackActions[key].roomsCreated)
    }
    for (let key of Object.keys(users)) {
        console.log(key + " : " + users[key]['url-init'])
    }
}, 1000)*/

