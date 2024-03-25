import React, { createContext, useEffect } from 'react';

const GameContext = createContext();


const GameContextProvider = ({ children }) => {
    const [game, setGame] = React.useState({
        // * Determines if the game has started, duh
        started: false,

        // * Determines the type of the game - ["bot", "player", "local", null] etc.
        type: null,

        // * Options specific to a game type. E.g. `difficulty` key for a "bot" type game
        options: {}
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