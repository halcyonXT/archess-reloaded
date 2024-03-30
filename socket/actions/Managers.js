const {log} = require('../../log.js');
const {users, tracker, gameRooms} = require('../maps.js');
const {buildSocketMessage} = require('../buildSocketMessage.js');
const {
    isMoveLegal
} = require('../chess/chessValidators.js');

const GameRoomManager = {
    io: null,

    _GAME_ROOM_DEFAULTS: () => ({
        _TTL_timer: null,
        _queue: [],
        started: false,
        white: null,
        black: null,
    }),

    _setIO: function(io) {
        this.io = io;
    },

    _TTL_CALLBACK: function() {

    },

    get: function(roomID) {
        return gameRooms.get(roomID)
    },

    applyDefaults: function(roomID) {
        gameRooms.set(roomID, this._GAME_ROOM_DEFAULTS());
    },

    startGame: function(roomID) {
        if (!this.get(roomID)) return;
    
        const START_GAME_EVENT_NAME = "game-begin";

        let isInitiatorWhite = Math.random() > 0.5;

        let gameRoom = this.get(roomID);

        gameRoom.started = true;

        clearTimeout(gameRoom._TTL_timer);

        let user0 = UserManager.get(gameRoom._queue[0]);
        let user1 = UserManager.get(gameRoom._queue[1]);

        UserManager.subscribe(user0.socket.id, user1.socket.id);
        UserManager.subscribe(user1.socket.id, user0.socket.id);

        this.io.to(gameRoom._queue[0]).emit(START_GAME_EVENT_NAME, ({
            opponentId: user1._id,
            opponentSid: gameRoom._queue[1],
            isWhite: isInitiatorWhite,
            gameRoomID: roomID
        }))

        this.io.to(gameRoom._queue[1]).emit(START_GAME_EVENT_NAME, ({
            opponentId: user0._id,
            opponentSid: gameRoom._queue[0],
            isWhite: !isInitiatorWhite,
            gameRoomID: roomID
        }))
    },

    // ! REQUIRES TRACKER
    killRoom: function(roomID, socket, socketReq = false) {
        let clientIP = UserManager.get(socket.id)._ip;
        let ipTarget = TrackerManager.ip.get(clientIP);

        if (socketReq || ipTarget?.roomsCreated.includes(roomID)) {
            if (!this.get(roomID)) return;

            gameRooms.delete(roomID);

            if (!socketReq) {
                TrackerManager.socket.get(socket)?.roomsCreated?.removeElementFromArray(roomID);
                ipTarget?.roomsCreated?.removeElementFromArray(roomID);
            }

            log("error", "Just killed room " + roomID)
            // TODO - Inform all subscriptions the room is dead
        }
    },

    registerMove: function(socket, info) {
        const getPlayerIndex = () => this.get(info.gameRoomID)?._queue.findIndex(sid => sid == socket.id);
        const getOtherIndex = (ind) => ind === 0 ? 1 : 0;

        
        let playerIndex = getPlayerIndex(info.gameRoomID);
        
        if ((playerIndex === -1) || (typeof playerIndex !== 'number')) return;

        if (!isMoveLegal(info.fen, info.move)) {
            this.io.to(gameRoom._queue[playerIndex]).emit("judge-move", ({
                accepted: false
            }))
            return;
        };

        log("succ", "Legal move played")
        
        let gameRoom = this.get(info.gameRoomID);
        let otherIndex = getOtherIndex(playerIndex);

        // console.log(gameRooms[info.gameRoomID]._queue[otherIndex]);
        // console.log("from: " + socket.id);
        this.io.to(gameRoom._queue[playerIndex]).emit("judge-move", ({
            accepted: true
        }))

        this.io.to(gameRoom._queue[otherIndex]).emit("opponent-move", ({
            move: info.move
        }))
    },

    // ! REQURIES TRACKER - BOTH SOCKET AND IP
    createRoom: function(socket, info) {
        let clientIP = UserManager.get(socket.id)._ip;
        const RESPONSE_EVENT_NAME = "approve-room";
        const TTL_EXPIRED_EVENT_NAME = "vacate-room";


        let ipTarget = TrackerManager.ip.get(clientIP);

        if (ipTarget?.roomsCreated?.length < 4) {
            this.applyDefaults(info.gameRoomID);

            let gameRoom = this.get(info.gameRoomID);
            gameRoom._queue.push(socket.id);

            gameRoom._TTL_timer = setTimeout(() => {
                // TODO - perform checks that will kill the room if nobody joins
                if (!gameRoom?.started) {
                    this.killRoom(info.gameRoomID, socket, true);
                }
            }, 600000); // 10 minutes

            ipTarget.roomsCreated.push(info.gameRoomID);

            TrackerManager.socket.get(socket).roomsCreated.push(info.gameRoomID);

            socket.join(info.gameRoomID);

            log("succ", socket.id + "client just created a room " + info.gameRoomID);

            let socketMessage = buildSocketMessage("Room created successfully", "success", info.gameRoomID);
            this.io.to(socket.id).emit(RESPONSE_EVENT_NAME, socketMessage);

        } else {
            let socketMessage = buildSocketMessage("Too many rooms created", "error", "");
            this.io.to(socket.id).emit(RESPONSE_EVENT_NAME, socketMessage);
        }
    }
}


const UserManager = {
    io: null,

    _setIO: function(io) {
        this.io = io;
    },

    _USER_DEFAULTS: (socket) => ({
        _id: null,
        _ip: null,
        socket: socket,
        "url-init": null,
        // TODO - SUBSCRIBERS
        subscribers: []
    }),

    applyDefaults: function(socket) {
        users.set(socket.id, this._USER_DEFAULTS(socket));
    },

    // TODO - make validator for change
    /**
     * Returns the object associated with the socket id
     * @param {String} key - Socket id 
     */
    get: function(key) {
        return users.get(key)
    },

    subscribe: function(socketID, subscriberSocketID) {
        let target = this.get(socketID);

        if (target && !target?.subscribers.includes(subscriberSocketID)) {
            target.subscribers.push(subscriberSocketID);
        }
    },

    unsubscribe: function(socketID, subscriberSocketID) {
        let target = this.get(socketID);

        if (target && target?.subscribers.includes(subscriberSocketID)) {
            target.subscribers.removeElementFromArray(subscriberSocketID);
        }
    },

    requestUpdateFromSubscribers: function(socketID) {
        let target = this.get(socketID);

        log("inf", "Requesting subscriber update");

        if (!target) return;

        for (let subscriber of target.subscribers) {
            this.io.to(subscriber).emit("update-subscriber", ({
                sid: socketID,
                id: target._id
            }))
        }
    },

    requestRoomJoin: function(socket, info) {
        if (info._id) {
            let user = users.get(socket.id);
            user._id = info._id;
        }
        if (users.get(socket.id)) {
            let urlParams = info.url.split('/');

            if (!urlParams[0]) {
                urlParams.shift()
            }

            if (urlParams.length === 0) return;

            switch (urlParams[0]) {
                case "room":

                    let gameRoom = GameRoomManager.get(urlParams[1]);
                    // * If the game room was created previously by socket, join the user to the channel
                    if (gameRoom) {
                        
                        socket.join(urlParams[1]);
                        log("success", "A client just joined existing room " + urlParams[1]);

                        if (gameRoom._queue.length < 2) {
                            gameRoom._queue.push(socket.id);
                            GameRoomManager.startGame(urlParams[1]);
                        }

                        this.get(socket.id)['url-init'] = info.url;
                    } else {
                        log("err", "A client tried joining fake room " + urlParams[1])
                    }
                    break
            }

        }
    },

    updateUser: function(socket, info) {
        if (typeof info !== 'object') return;

        let target = this.get(socket.id);

        for (let key of Object.keys(info)) {
            if (target.hasOwnProperty(key)) {
                target[key] = info[key];
            }
        }

        this.requestUpdateFromSubscribers(socket.id);
    },

    handleDisconnect: function(socket) {
        users.delete(socket.id);
    }

}



const TrackerManager = {
    ip: {
        _IP_TRACK_DEFAULTS: () => ({
            socketConnections: 0,
            roomsCreated: []
        }),

        get: function(ip){
            return tracker.ip.get(ip);
        },

        applyDefaults: function(ip) {
            tracker.ip.set(ip, this._IP_TRACK_DEFAULTS());
        },

        register: function(ip) {
            let target = tracker.ip.get(ip);

            if (target) {
                target.socketConnections++;
            } else {
                this.applyDefaults(ip);
            }
        }
    },

    socket: {
        _SOCKET_TRACK_DEFAULTS: () => ({
            roomsCreated: []
        }),

        get: function(socket) {
            return tracker.socket.get(socket.id);
        },

        applyDefaults: function(socket) {
            tracker.socket.set(socket.id, this._SOCKET_TRACK_DEFAULTS());
        },

        register: function(socket) {
            this.applyDefaults(socket);
        }
    },

    handleSocketDisconnection: function(socket) {
        let clientIP = UserManager.get(socket.id)._ip;

        let socketTarget = this.socket.get(socket);
        let ipTarget = this.ip.get(clientIP);

        if (socketTarget) {
            for (let room of socketTarget?.roomsCreated) {
                log("err", "Disconnection killing room " + room);
                GameRoomManager.killRoom(room, socket);
            }
        }

        tracker.socket.delete(socket.id);

        if (ipTarget) {
            ipTarget.socketConnections -= 1;

            if (ipTarget.socketConnections === 0) {
                tracker.ip.delete(clientIP);
            }
        }

        log("err", "Disconnected")
    }
}


module.exports = {
    UserManager,
    GameRoomManager,
    TrackerManager
};