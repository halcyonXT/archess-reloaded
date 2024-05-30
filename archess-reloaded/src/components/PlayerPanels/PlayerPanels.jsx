import React from 'react'
import { GameContext } from '../../context/GameContext'
import { UserContext } from '../../context/UserContext';
import './PlayerPanels.css'
import { SubscriptionContext } from '../../context/SubscriptionContext';
import { ICONS } from '../../Icons';
import { ThemeContext } from '../../context/ThemeContext';

const DEFAULT_PFP_URL = "https://i.ibb.co/g4Gr8wv/default-pfp.png";

const MATERIAL_TABLE = {
    q: 9,
    r: 5,
    b: 3,
    n: 3,
    p: 1
}

export default function PlayerPanels(props) {
    const {game} = React.useContext(GameContext);
    const {user} = React.useContext(UserContext);
    const {subscribers} = React.useContext(SubscriptionContext);
    const {theme} = React.useContext(ThemeContext);

    const [materials, setMaterials] = React.useState({
        player: [],
        playerCount: 0,
        opponent: [],
        opponentCount: 0
    })

    const [movePairs, setMovePairs] = React.useState([]);


    //console.log(movePairs)

    let movesToRender = movePairs.map((move, index) => {
       // console.log(move)

        let rindex = index + 1;

        let move2;
        const pieceRegex = /^[NBRQK]/;

        let move1pc = move[0].notation.match(pieceRegex);

        if (move1pc) {
            move1pc = `w${move1pc[0].toLowerCase()}`
        } else move1pc = `wp`

        let move1 = <>{ICONS.pieces[move1pc]}{move[0].notation}</>
        
        if (move.length === 2) {
            let move2pc = move[1].notation.match(pieceRegex);

            if (move2pc) {
                move2pc = `b${move2pc[0].toLowerCase()}`
            } else move2pc = `bp`
            move2 = <>{ICONS.pieces[move2pc]}{move[1].notation}</>
        }

        const clearFENCallback = () => game.set(p => ({...p, _fenLoadOnHover: null}));

        return (
            <div className="-lp-moves-move">
                <div className="-lp-moves-move-bg"></div>
                <span className="-lp-moves-id">
                    {rindex}.
                </span>
                <div className="-lp-moves-move-notation"
                    onMouseEnter={() => game.set(p => ({...p, _fenLoadOnHover: move[0].fen, _fenMoveNum: rindex}))}
                    onMouseLeave={clearFENCallback}
                >
                    {move1}
                </div>
                {
                    move.length === 2
                    &&
                    <div className="-lp-moves-move-notation"
                        onMouseEnter={() => game.set(p => ({...p, _fenLoadOnHover: move[1].fen, _fenMoveNum: rindex}))}
                        onMouseLeave={clearFENCallback}
                    >
                        {move2}
                    </div>
                }
            </div>
        )
    })

    React.useEffect(() => {
        if (game.value._game) {
            let mps = [];
            let history = game.value._game.history({verbose: true});
            let pair = [];

            for (let move of history) {
                pair.push({
                    fen: move.after,
                    notation: move.san
                });

                if (pair.length === 2) {
                    mps.push(pair);
                    pair = [];
                }
            }

            if (pair.length === 1){
                mps.push(pair);
            }

            setMovePairs(mps);
        }
    }, [game])

    React.useEffect(() => {

        game.set(p => {
            let outp = {...p};
            outp.opponent = {
                ...outp.opponent,
                ...subscribers.value[outp.opponent.sid]
            }
            return outp;
        })

    }, [subscribers.value])

    React.useEffect(() => {

        if (game.value.boardExtras.hasOwnProperty("white") && game.value.options.hasOwnProperty("isWhite")) {

            let playerColor = !game.value.options.isWhite ? "black" : "white";
            let oppColor = !game.value.options.isWhite ? "white" : "black";


            let playerMaterialsByValue = [...game.value.boardExtras[playerColor]?.materialCaptured].sort((a, b) => MATERIAL_TABLE[b] - MATERIAL_TABLE[a]);
            let oppMaterialsByValue = [...game.value.boardExtras[oppColor]?.materialCaptured].sort((a, b) => MATERIAL_TABLE[a] - MATERIAL_TABLE[b]);

            let plaOutp = [], oppOutp = [], plaVal = 0, oppVal = 0;

            for (let piece of playerMaterialsByValue) {
                plaVal += MATERIAL_TABLE[piece];
                plaOutp.push(ICONS.pieces[`${oppColor.slice(0, 1)}${piece}`]);
            }

            for (let piece of oppMaterialsByValue) {
                oppVal += MATERIAL_TABLE[piece];
                oppOutp.push(ICONS.pieces[`${playerColor.slice(0, 1)}${piece}`]);
            }

            setMaterials({
                player: plaOutp,
                playerCount: plaVal,
                opponent: oppOutp,
                opponentCount: oppVal
            })
        }

    }, [game]);


    if (props.side === "left") {
        return (
            <div className="-ppanel -left-player">
                    <div className="-lp-profile">
                        <div className="-lp-profile-username">
                            {
                                user.value.username ?? "Guest"
                            }
                        </div>
                        <div className="-profile-user">
                            {
                                user.value.description ?? "A non-registered user"
                            }
                        </div>
                        <div className={`-profile-materials ${theme === "dark" ? "drop-sh" : ""}`}>
                            {materials.playerCount}&nbsp;&nbsp;{materials.player}
                        </div>
                    </div>
                    <div style={{backgroundImage: props.pBgs.left.col}} className="-lp-bg-bg">
                        <div className='-lp-bg'>
                        </div>
                    </div>
                    <div className="-lp-bg-pfp">
                        <img
                            src={
                                !user.value.profilePicture
                                ?
                                DEFAULT_PFP_URL
                                :
                                user.value.profilePicture
                            }
                        />
                    </div>
                    <div className="-lp-moves-wrapper">
                        {
                            movesToRender
                        }
                    </div>
            </div>
        )
    }

    if (props.side === "right") {
        return (
            <div className="-ppanel -right-player">
                <div className="-rp-profile">
                    <div className="-rp-profile-username">
                        {
                            game.value.opponent.username
                        }
                    </div>
                    <div className="-profile-user -right">
                        {
                            game.value.opponent.description ?? "A non-registered user"
                        }
                    </div>
                    <div className={`-profile-materials -right ${theme === "dark" ? "drop-sh" : ""}`}>
                        {materials.opponent}&nbsp;&nbsp;{materials.opponentCount}
                    </div>
                </div>
                <div style={{backgroundImage: props.pBgs.right.col}} className="-rp-bg-bg">
                    <div className='-rp-bg'></div>
                </div>
                <div className="-rp-bg-pfp">
                    {
                        game.value.type === 'bot'
                        ?
                        <img
                            className='-bot-pfp'
                            src={props.pBgs.right.pfp}
                        />
                        :
                        <img
                            className='-pl-pfp'
                            src={
                                !game.value.opponent.profilePicture
                                ?
                                DEFAULT_PFP_URL
                                :
                                game.value.opponent.profilePicture
                            }
                        />
                    }
                </div>
                <div className='-rp-buttons'>
                    <div className="-rp-buttons-button">
                        OFFER A DRAW
                    </div>
                    <div className="-rp-buttons-button">
                        FORFEIT
                    </div>
                </div>
                <div className="-rp-buttons-button -rp-buttons-turnback">
                    REQUEST A DRAWBACK
                </div>
                <div className="-rp-chat-wrapper">
                    <input type="text" className="-community-main-panel-navbar-input -ingame" placeholder='Type a message here...'/>
                    <div className="-rp-chat-notice">
                        This is the beginning of your chat with {game.value.opponent.username}. Remember to be respectful
                    </div>
                </div>
            </div>
        )
    }
}
