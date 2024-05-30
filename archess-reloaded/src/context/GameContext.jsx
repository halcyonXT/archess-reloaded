import React, { createContext, useEffect } from 'react';

const GameContext = createContext();

const DEFAULT_OPPONENT = () => ({
    _id: null,
    sid: null,
    isBot: true,
    username: null,
    profilePicture: null,
    background: null
})

const GameContextProvider = ({ children }) => {
    const [game, setGame] = React.useState({
        // * Reference to the current game class instance in Chessboard component
        _game: null,

        // * String representing FEN that is loaded when a player hover over a move on the left side of the panel
        _fenLoadOnHover: null,
        _fenMoveNum: null,

        // * Determines if the game has started, duh
        started: false,

        // * Determines the type of the game - ["bot", "player", "local", null] etc.
        type: null,

        specs: {
            timeTotal: 600, // in secs
            timeAddition: 0, // per move, in secs
            stars: 3,
            startAs: "random"
        },

        // * Options specific to a game type. E.g. `difficulty` key for a "bot" type game
        options: {},

        boardExtras: {},

        opponent: DEFAULT_OPPONENT(),

        // ! TO WORK
        userOptions: {}
    })


    return (
        <GameContext.Provider value={{
            game: {
                value: game,
                set: setGame
            }
        }}>
            {children}
        </GameContext.Provider>
    );
};

export { GameContextProvider, GameContext }