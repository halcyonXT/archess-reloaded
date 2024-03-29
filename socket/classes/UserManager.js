const {log} = require('../../log.js');

// ! abandon

class UserManager {
    constructor() {
        this.data = new Map();
    }

    #USER_DEFAULTS = () => ({
        _ip: null,
        _id: null,
        'url-init': null
    })

    applyDefaults(socketID) {
        this.data.set(socketID, this.#USER_DEFAULTS());
    }

    // TODO - implement change validator e.g. checks for type
    change(key, value) {
        this.data.set(key, value);
    }

    acceptEvent(eventName, socket, req) {
        switch (eventName) {
            case "client-init":
                if (users[socket.id]) {
                    let urlParams = req.url.split('/');
        
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
        
                                users[socket.id]['url-init'] = req.url;
                            } else {
                                log("err", "A client tried joining fake room " + urlParams[1])
                            }
                            break
                    }
        
                }
                break
        }
    }
}

module.exports = UserManager;