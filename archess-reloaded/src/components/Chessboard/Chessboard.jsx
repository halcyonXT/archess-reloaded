import React from 'react'
import './Chessboard.css'
import { Chess } from 'chess.js'
import { ICONS } from '../../Icons'
import Svg from '../Svg'
import { highlightSquares } from './HighlightSquareHandler'
import { GameContext } from '../../context/GameContext'
import { SocketContext } from '../../context/SocketContext'

const DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'




const ALL_SQUARES = [
    "h1",
    "g1",
    "f1",
    "e1",
    "d1",
    "c1",
    "b1",
    "a1",
    "h2",
    "g2",
    "f2",
    "e2",
    "d2",
    "c2",
    "b2",
    "a2",
    "h3",
    "g3",
    "f3",
    "e3",
    "d3",
    "c3",
    "b3",
    "a3",
    "h4",
    "g4",
    "f4",
    "e4",
    "d4",
    "c4",
    "b4",
    "a4",
    "h5",
    "g5",
    "f5",
    "e5",
    "d5",
    "c5",
    "b5",
    "a5",
    "h6",
    "g6",
    "f6",
    "e6",
    "d6",
    "c6",
    "b6",
    "a6",
    "h7",
    "g7",
    "f7",
    "e7",
    "d7",
    "c7",
    "b7",
    "a7",
    "h8",
    "g8",
    "f8",
    "e8",
    "d8",
    "c8",
    "b8",
    "a8"
];

let game = null;

let selectedSquare = null;
const EMPTY_CURRENT_HIGHLIGHTED = () => ({ from: null, to: null });
let currentHighlighted = EMPTY_CURRENT_HIGHLIGHTED();
let lastMove = EMPTY_CURRENT_HIGHLIGHTED();

function asynchronize(blockingFunction, callback) {
    setTimeout(() => {
        try {
            const result = blockingFunction();
            callback(null, result);
        } catch (error) {
            callback(error, null);
        }
    }, 0);
}

let moveValidationInProgress = false;
export default function Chessboard(props) {
    const __GAME_CTX = React.useContext(GameContext);

    const {socket} = React.useContext(SocketContext);

    console.log(__GAME_CTX)
    const [player, setPlayer] = React.useState({
        color: __GAME_CTX.game.value.options.isWhite ? "white" : "black"
    })

    const [board, changeBoard] = React.useState({
        value: null,
        playerMoves: {},
    })
    
    let gameRef = React.useRef(null);
    gameRef.current = game;

    React.useEffect(() => {
        game = new Chess();

        changeBoard({
            value: game.board(),
            playerMoves: game.moves()
        });

        // ! If player is black and the game is against a bot, opponent move immediately
        if (__GAME_CTX.game.value.type === "bot" && player.color === "black") {
            opponentMove();
        }

    }, [])

    React.useEffect(() => {
        const retrieveMoveHandler = response => {
            if (response.status === "success") {
                let moveNotation = response.data.continuation.split(" ")[0];

                let m = game.move(moveNotation);

                const [from, to] = moveNotation.match(/[a-h][1-8]/g);
                lastMove = {from, to};

                changeBoard({
                    value: game.board(),
                    playerMoves: null
                })
            }
        }

        const retrieveOpponentMoveHandler = response => {
            let m = game.move(response.move);

            const [from, to] = response.move.match(/[a-h][1-8]/g);
            lastMove = {from, to};

            changeBoard({
                value: game.board(),
                playerMoves: null
            })
        }

        if (__GAME_CTX.game.value.type === "bot") {
            socket.on("retrieveMove", retrieveMoveHandler);
        } else {
            socket.off("retrieveMove", retrieveMoveHandler);
        }

        if (__GAME_CTX.game.value.type === "private-online") {
            console.log("on playmove")
            socket.on("opponent-move", retrieveOpponentMoveHandler)
        } else {
            socket.off("opponent-move", retrieveOpponentMoveHandler)
        }


        return () => {
            try {
                socket.off("retrieveMove", retrieveMoveHandler);
                socket.off("opponent-move", retrieveOpponentMoveHandler)
            } catch (ex) {}
        }

    }, [__GAME_CTX])



    /**
     * Function that generates the move of the opponent based on the type of game that is being played
     */
    const opponentMove = () => {
        switch (__GAME_CTX.game.value.type) {
            case "bot":
                let fen = game.fen();
                setTimeout(() => {
                    try {
                        socket.emit(
                            "getMove",
                            ({
                                fen,
                                depth: __GAME_CTX.game.value.options.difficulty
                            })
                        )
                    } catch (ex) {
                        console.warn(ex);
                    }
                }, 5)
                break
                
            default:
                break
        }
    }


    // ! Contrary to the name, this function is only for the client, DO NOT use this function to register opponent moves from the backend
    const movePiece = async (from, to) => {
        const acceptedMove = () => {
            game.move({from, to});

            changeBoard({
                value: game.board(),
                playerMoves: null
            })

            lastMove = {from, to};
            currentHighlighted = EMPTY_CURRENT_HIGHLIGHTED();

            highlightSquares({available: [], from: null}, true);
            opponentMove();
        }

        if (__GAME_CTX.game.value.type === "private-online") {
            const determineVerdict = (res) => {
                if (res.accepted) {
                    acceptedMove();
                }

                socket.off("judge-move", determineVerdict);
            }

            socket.emit("play-move", ({
                gameRoomID: __GAME_CTX.game.value.options.gameRoomID,
                fen: game.fen(),
                move: from + to
            }))

            socket.on("judge-move", determineVerdict);
        
        } else {

            acceptedMove();
        }
    }

    const registerClick = (e) => {

        function findParentWithAttribute(element, attribute) {
            if (element.getAttribute && element.getAttribute(attribute)) {
                return element;
            }
            if (element.parentNode) {
                return findParentWithAttribute(element.parentNode, attribute);
            }
            return null;
        }

        let square = findParentWithAttribute(e.target, "data-sq");

        if (!square) {
            currentHighlighted = EMPTY_CURRENT_HIGHLIGHTED();
            return highlightSquares({from: null, available: null}, true);
        }

        square = square.dataset.sq;

        if (currentHighlighted.to?.includes(square.toLowerCase())) {
            return movePiece(currentHighlighted.from, square);
        }

        let getSq = game.get(square);

        if (!getSq) {
            currentHighlighted = EMPTY_CURRENT_HIGHLIGHTED();
            return highlightSquares({from: null, available: null}, true);
        }

        let isPermittedToMove = getSq?.color === player.color.slice(0, 1);

        if (!isPermittedToMove) return;

        let moves = game.moves({ square: square.toLowerCase(), verbose: true })

        let toHighlight = moves.map(obj => obj.to);
        currentHighlighted = {from: square, to: toHighlight};
        highlightSquares({available: toHighlight, from: square})
    }

    return (
        <div className='-chessboard-wrapper'>
            {
                board.value
                &&
                <RenderedChessboard registerClick={registerClick} game={gameRef.current} player={player} />
            }
        </div>
    )
}

const RenderedChessboard = (props) => {
    if (!props.game) return <></>;
    return (
        <table className='-chessboard' onMouseDown={props.registerClick}>
            {
                (() => {
                    let outp = [];
                    let board = props.game.board().flat().reverse();
                    if (props.player.color === "black") {
                        for (let i = 0, isOdd = true; i < 64; i++) {
                            if (i % 8 === 0) {
                                isOdd = !isOdd;
                            }
                            let pc = board[i];
                            let csq = ALL_SQUARES[i];
                            outp.push(
                                <div 
                                    className={`-chessboard-cell 
                                    ${lastMove.from === csq ? "from" : lastMove.to === csq ? "to" : ""} 
                                    ${isOdd ? "odd" : "even"} 
                                    ${ALL_SQUARES[i]}`} 
                                    data-sq={`${ALL_SQUARES[i]}`}>
                                    {
                                        pc
                                        ?
                                        (
                                            pc.color === 'w'
                                            ?
                                            ICONS.pieces[`w${pc.type.toLowerCase()}`]
                                            :
                                            ICONS.pieces[`b${pc.type}`]
                                        )
                                        :
                                        <></>
                                    }
                                </div>
                            )
                        }
                    }
                    if (props.player.color === "white") {
                        for (let i = 63, isOdd = false; i >= 0; i--) {
                            if ((i + 1) % 8 === 0) {
                                isOdd = !isOdd;
                            }
                            let pc = board[i];
                            let csq = ALL_SQUARES[i];
                            outp.push(
                                <div 
                                className={`-chessboard-cell ${lastMove.from === csq ? "from" : lastMove.to === csq ? "to" : ""} 
                                ${isOdd ? "odd" : "even"} 
                                ${ALL_SQUARES[i]}`} 
                                data-sq={`${ALL_SQUARES[i]}`}>
                                    {
                                        pc
                                        ?
                                        (
                                            pc.color === 'w'
                                            ?
                                            ICONS.pieces[`w${pc.type.toLowerCase()}`]
                                            :
                                            ICONS.pieces[`b${pc.type}`]
                                        )
                                        :
                                        <></>
                                    }
                                </div>
                            )
                        }
                    }
                    return outp;
                })()
            }
        </table>
    )
}
