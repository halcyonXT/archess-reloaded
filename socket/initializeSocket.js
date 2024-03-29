const socketio = require('socket.io');
const cors = require('cors');

const {log} = require('../log.js');
const {buildSocketMessage} = require('./buildSocketMessage.js');
const {moveFetcher} = require('./chess/moveFetcher.js')



const LOCALHOST_LOOPBACK = "::1";



function initializeSocket(server) {
    const io = socketio(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });

    const {
        users,
        gameRooms,
        tracker
    } = require('./maps.js');
    
    const {
        UserManager,
        GameRoomManager,
        TrackerManager
    } = require('./actions/Managers.js')

    GameRoomManager._setIO(io);
    

    io.on('connection', socket => {
        log("inf", "New WS connection");

        ;(function init() {
            UserManager.applyDefaults(socket);

            const clientIP = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;

            const user = UserManager.get(socket.id);
            user._ip = clientIP;

            TrackerManager.ip.register(clientIP);
            TrackerManager.socket.register(socket);

        })();
        
    
    
        // * will recieve url pathname, used for joining channels
        socket.on('client-init', info => {
            UserManager.requestRoomJoin(socket, info);
        });
    
        socket.on('play-move', info => {
            GameRoomManager.registerMove(socket, info);
        })
    
        socket.on('kill-room', info => {
            GameRoomManager.killRoom(info.gameRoomID, socket)
        })
    
        socket.on('create-room', info => {
            GameRoomManager.createRoom(socket, info)
        })
    
        socket.on('getMove', async (options) => {
            let socketMessage = await moveFetcher(options.fen, options.depth);
            
            io.to(socket.id).emit("retrieveMove", socketMessage);
        })
    
        socket.on('disconnect', () => {

            TrackerManager.handleSocketDisconnection(socket);

            UserManager.handleDisconnect(socket);
        })
    })
}



module.exports = initializeSocket;