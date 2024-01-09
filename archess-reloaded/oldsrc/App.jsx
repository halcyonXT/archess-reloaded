import React from 'react'
import './App.css'
import StartupInterface from './StartupInterface/StartupInterface';

// ! In the app component is the main interface the user gets before starting a game
// TODO

function App() {
    const [game, setGame] = React.useState({
        started: false,

        // * Types: "quick", "local", "private", "bot", null
        type: null,

        // * Options are specific to each type
        options: {}
    });

    const [user, setUser] = React.useState({
        loggedIn: false
    })

    const initiateGame = (type) => {
        // * Guard clause preventing the user from re-initiating the game while the animation plays
        if (game.started) return;

        switch (type) {
            case "local":
                setGame({
                    started: true,
                    type: "local",
                    options: {}
                })
                break
        }
    }

    return (
        <div className={`-main ${game.started ? "-close-main" : ""}`}>
            {
                <StartupInterface
                    initiateGame={initiateGame}
                    user={user}
                />
            }
        </div>
    )
}

export default App
