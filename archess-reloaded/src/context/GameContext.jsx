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
        // * Determines if the game has started, duh
        started: false,

        // * Determines the type of the game - ["bot", "player", "local", null] etc.
        type: null,

        // * Options specific to a game type. E.g. `difficulty` key for a "bot" type game
        options: {},

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