const { server, log } = require("../server");
const socketio = require('socket.io');

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});



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