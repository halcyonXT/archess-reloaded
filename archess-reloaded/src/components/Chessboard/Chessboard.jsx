import React from 'react'
import './Chessboard.css'
import { Chess } from 'chess.js'
import { ICONS } from '../../Icons'
import Svg from '../Svg'
import { highlightSquares } from './HighlightSquareHandler'
import { GameContext } from '../../context/GameContext'
import { SocketContext } from '../../context/SocketContext'
import gsap from 'gsap'

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



let boardExtras = {
    evaluation: 0,
    mate: null,
    white: {
        inCheck: false,
        isCheckmated: false,
        materialCaptured: []
    },
    black: {
        inCheck: false,
        isCheckmated: false,
        materialCaptured: []
    }
}
let moveValidationInProgress = false;

const evaluations = {
    0: 0,
};

export default function Chessboard(props) {
    const __GAME_CTX = React.useContext(GameContext);

    const {socket} = React.useContext(SocketContext);

    const [shouldChessboardRender, setShouldChessboardRender] = React.useState(true);

    const [player, setPlayer] = React.useState({
        color: 
            (__GAME_CTX.game.value.options.isWhite && __GAME_CTX.game.value.type !== "bot") 
            ? 
            "white" 
            :
            __GAME_CTX.game.value.type === "bot"
            ?
            (
                __GAME_CTX.game.value.specs.startAs !== "random"
                ?
                __GAME_CTX.game.value.specs.startAs
                :
                (Math.random() > 0.5 ? "black" : "white")
            )
            : 
            "black"
    })

    //console.log(__GAME_CTX);
    //console.log(player)

    const [board, changeBoard] = React.useState({
        value: null,
        playerMoves: {},
    })

    const [promotionModal, setPromotionModal] = React.useState({
        from: null,
        onSquare: null,
        color: null,
        element: <></>
    })
    
    let gameRef = React.useRef(null);
    gameRef.current = game;

    React.useEffect(() => {
        game = new Chess();

        __GAME_CTX.game.set(p => ({...p, _game: game}));

        changeBoard({
            value: game.board(),
            playerMoves: game.moves()
        });

        // ! If player is black and the game is against a bot, opponent move immediately
        if (__GAME_CTX.game.value.type === "bot" && player.color === "black") {
            opponentMove();
        }

        /*document.querySelector(".-chessboard")?.animate([
            {transform: "scale(0.95)",
            opacity: 0},
            {transform: "scale(1)",
            opacity: 1,}
        ], {
            duration: 450,
            easing: "ease-out",
            fill: "forwards"
        })*/
    }, [])

    //console.log(evaluations)
    //console.log(__GAME_CTX.game.value._fenMoveNum)

    React.useEffect(() => {
        const retrieveMoveHandler = response => {
            if (response.status === "success") {
                let moveNotation = response.data.continuation.split(" ")[0];

                let evalLen = (Object.keys(evaluations)).length;
                if (response.data.evaluation) {
                    boardExtras.evaluation = response.data.evaluation;
                    evaluations[evalLen] = {
                        evaluation: response.data.evaluation,
                        mate: response.data.mate
                    };
                }
                if (response.data.mate) {
                    boardExtras.mate = response.data.mate;
                }

                boardActions.performChecksAndMove(moveNotation);

                const [from, to] = moveNotation.match(/[a-h][1-8]/g);
                lastMove = {from, to};

                changeBoard({
                    value: game.board(),
                    playerMoves: null
                })
            }
        }

        const retrieveOpponentMoveHandler = response => {
            let m = boardActions.performChecksAndMove(response.move);

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
        if (moveValidationInProgress) return;

        const prom = promotion.isPromotionSquare(to);

        if (prom && (game.get(from))?.type === "p") {
            return promotion.requestPromotionModal(from, to);
        }

        if (promotionModal.onSquare) {
            promotion.emptyPromotionModal();
        }

        const acceptedMove = () => {
            boardActions.performChecksAndMove(from + to);
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
                moveValidationInProgress = false;
                if (res.accepted) {
                    acceptedMove();
                }
                socket.off("judge-move", determineVerdict);
            }

            moveValidationInProgress = true;
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

    const boardActions = {
        performChecksAndMove: function(fullForm) {
            let [from, to] = fullForm.match(/[a-h][1-8]/g);

            this._premoveChecks(from, to);

            game.move(fullForm);

            this._postmoveChecks(from, to);

            __GAME_CTX.game.set(p => ({...p, boardExtras: boardExtras}));
        },

        _premoveChecks: function(from, to) {
            this.checkForMaterialCapture(to);
        },

        _postmoveChecks: function(from, to) {
            this.checkForChecks();
            this.checkForCheckmates();
        },

        checkForMaterialCapture: (attackedSquare) => {
            let turn = game.turn() === "b" ? "black" : "white";
            let pc = game.get(attackedSquare);

            
            
            if (pc) {
                boardExtras[turn]?.materialCaptured.push((pc?.type)?.toLowerCase());
            }
        },

        checkForChecks: (forceRefresh = false) => {
            let turn = game.turn() === "b" ? "black" : "white";

            boardExtras["black"].inCheck = false;
            boardExtras["white"].inCheck = false;
            
            boardExtras[turn].inCheck = game.inCheck();
        },

        checkForCheckmates: () => {
            let whose = game.turn() !== "b" ? "black" : "white";

            let isCheckmate = game.isCheckmate();

            if (isCheckmate) {
                triggerCheckmateSequence();
                boardExtras[whose].isCheckmated = true;
            }
        },
    }


    const promotion = {
        promoteCurrent: (piece) => {
            movePiece(promotionModal.from, promotionModal.onSquare + "=" + piece);
        },

        emptyPromotionModal: () => {
            setPromotionModal({
                from: null,
                onSquare: null,
                color: null,
                element: <></>
            })
        },

        requestPromotionModal: (from, sq) => {
            setPromotionModal({
                from: from,
                onSquare: sq,
                color: game.turn() === "b" ? "black" : "white",
                element: <></>
            })
        },

        isPromotionSquare: (sq) => {
            let turn = game.turn() === "b" ? "black" : "white";
    
            if ((turn === player.color)) {
                let psquare = turn === "black" ? "1" : "8";
                if (sq.slice(-1) == psquare) {
                    return true;
                }
            }
    
            return false;
        },
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

        if (promotionModal.onSquare) {
            promotion.emptyPromotionModal();
        }

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

    const triggerCheckmateSequence = () => {
        let toRemove = [...document.querySelectorAll('.-ppanel'), document.querySelector('.-chessboard-wrapper')];

        for (let element of toRemove) {
            element.animate([
                {opacity:1},
                {opacity: 0}
            ], {
                duration: 1000,
                fill: "forwards",
                easing: "ease-out"
            })
        }


        setTimeout(() => {
            setShouldChessboardRender(false)
        }, 1000)
    }


    return (
        
            shouldChessboardRender
            &&
            (
                <>
                    <div className='-chessboard-wrapper' style={__GAME_CTX.game.value._fenLoadOnHover ? {display: "none"} : {}}>
                        {
                            board.value
                            &&
                            <RenderedChessboard 
                                promotionModal={promotionModal} 
                                promotion={promotion}
                                registerClick={registerClick} 
                                game={gameRef.current} 
                                player={player} 
                            />
                        }
                        <Evaluation
                            evaluation={boardExtras.evaluation}
                            mate={boardExtras.mate}
                        />
                    </div>
                    {
                        __GAME_CTX.game.value._fenLoadOnHover
                        &&
                        <div className='-chessboard-wrapper'>
                            {
                                board.value
                                &&
                                <>
                                    <RenderedChessboard 
                                        promotionModal={promotionModal} 
                                        promotion={promotion}
                                        registerClick={registerClick} 
                                        game={__GAME_CTX.game.value._fenLoadOnHover} 
                                        player={player} 
                                    />
                                    {
                                        __GAME_CTX.game.value.type === "bot"
                                        &&
                                        <Evaluation
                                            evaluation={evaluations[__GAME_CTX.game.value._fenMoveNum].evaluation}
                                            mate={evaluations[__GAME_CTX.game.value._fenMoveNum].mate}
                                            backward
                                        />
                                    }
                                </>
                            }
                        </div>
                    }
                </>
            )
        
    )
}

const EVAL_MAX = 30;
const Evaluation = (props) => {
    //console.log(props)
    

    let winningSign = props.evaluation > 0 ? 1 : -1;
    let scaleTo = props.mate ? (props.mate < 0 ? 0 : 1) : Math.max(0, Math.min(1, 0.5 + (((Math.abs(props.evaluation) / EVAL_MAX) / 2) * winningSign))); 

    let ws2 = props.backward ? (boardExtras.evaluation > 0 ? 1 : -1) : null;
    let st2 = props.backward ? (boardExtras.mate ? (boardExtras.mate < 0 ? 0 : 1) : Math.max(0, Math.min(1, 0.5 + (((Math.abs(boardExtras.evaluation) / EVAL_MAX) / 2) * ws2)))) : null;

    if (props.backward) {
        setTimeout(() => {
            gsap.fromTo(".-evaluation-invbar", {
                transform: `scaleX(${st2})`
            }, {
                transform: `scaleX(${scaleTo})`,
                duration: 0.5,
                ease: 'power1.out'
            })
        
        }, 10)
    } else {
        gsap.to(".-evaluation-invbar", {
            transform: `scaleX(${scaleTo})`,
            duration: 0.5,
            ease: 'power1.out'
        })
    }
    



    return (
        <div className="-evaluation">
            <div className="-evaluation-numbers">
                <span>{props.mate ? ("M" + Math.abs(props.mate)) : props.evaluation}</span>
            </div>
            <div className="-evaluation-invbar" style={props.backward ? {transform: `scaleX(${st2})`} : {}}>

            </div>
        </div>
    )
}

const RenderedChessboard = (props) => {
    if (!props.game) return <></>;
    const __GAME_CTX = React.useContext(GameContext);

    let game;

    if (props.game) {
        if (typeof props.game === "string") {
            game = new Chess(props.game);
        } else {
            game = props.game;
        }
    }

    return (
        <table className='-chessboard' onMouseDown={props.registerClick}>
            {
                (() => {
                    let outp = [];
                    let board = game.board().flat().reverse();
                    let promotionElement, psquare;

                    if (props.promotionModal.onSquare) {

                        let sq = props.promotionModal.onSquare;
                        psquare = sq;
                        let short = props.promotionModal.color.slice(0, 1);
                        let letter = sq.slice(0, 1);
                        let isToLeft = (short === "w") ? ((letter > "d") ? true : false) : ((letter < "e") ? true : false);

                        promotionElement = (
                            <div className={`-chessboard-promotion-modal ${isToLeft ? "-toleft" : "-toright"}`}>
                                <div className="-fullheight" onClick={() => props.promotion.promoteCurrent("Q")}>
                                    {ICONS.pieces[`${short}q`]}
                                </div>
                                <div className="-fullheight" onClick={() => props.promotion.promoteCurrent("B")}>
                                    {ICONS.pieces[`${short}b`]}
                                </div>
                                <div className="-fullheight" onClick={() => props.promotion.promoteCurrent("N")}>
                                    {ICONS.pieces[`${short}n`]}
                                </div>
                                <div className="-fullheight" onClick={() => props.promotion.promoteCurrent("R")}>
                                    {ICONS.pieces[`${short}r`]}
                                </div>
                            </div>
                        )
                    }

                    if (true) {
                        for (let j = 0, isOdd = false; j < 64; j++) {
                            let i;
                            if (props.player.color === "white") {
                                i = (ALL_SQUARES.length - 1) - j;
                            } else i = j;
                            if ((i + (props.player.color === "white")) % 8 === 0) {
                                isOdd = !isOdd;
                            }
                            let pc = board[i];
                            let csq = ALL_SQUARES[i];
                            let inCheck = false, col = pc?.color === "b" ? "black" : "white";
                            if (__GAME_CTX.game.value.boardExtras[col]?.inCheck && (pc?.type?.toLowerCase() === "k")) {
                                inCheck = true;
                            }
                            outp.push(
                                <div 
                                    className={`-chessboard-cell 
                                    ${inCheck ? "-checked" : ""}
                                    ${lastMove.from === csq ? "from" : lastMove.to === csq ? "to" : ""} 
                                    ${isOdd ? "odd" : "even"} 
                                    ${ALL_SQUARES[i]}`} 
                                    data-sq={`${ALL_SQUARES[i]}`}>
                                    {
                                        (psquare && psquare == ALL_SQUARES[i])
                                        &&
                                        promotionElement
                                    }
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
