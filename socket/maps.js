const users = new Map();
const gameRooms = new Map();
const quickMatchQueue = new Map();

const tracker = {
    ip: new Map(),
    socket: new Map()
}

module.exports = {
    users,
    gameRooms,
    quickMatchQueue,
    tracker
}