import React from 'react'
import Svg from '../Svg'
import __R_BEGINNER from '../../assets/robot-beginner.webp'
import __SVG_BEGINNER from '../../assets/r_beginner.svg'
import __R_EASY from '../../assets/robot-easy.webp'
import __SVG_EASY from '../../assets/r_easy.svg'
import __R_MEDIUM from '../../assets/robot-medium.webp'
import __SVG_MEDIUM from '../../assets/r_medium.svg'
import __R_HARD from '../../assets/robot-hard.webp'
import __SVG_HARD from '../../assets/r_hard.svg'
import __R_ADVANCED from '../../assets/robot-advanced.webp'
import __SVG_ADVANCED from '../../assets/r_advanced.svg'
import __R_EXPERT from '../../assets/robot-expert.webp'
import __SVG_EXPERT from '../../assets/r_expert.svg'

import { ThemeContext } from '../../context/ThemeContext'
import { CustomRouter, Route } from '../CustomRouter'

const BOT_IMAGE_STYLES = (diff) => ({
    position: 'absolute',
    right: '29.5%',
    bottom: '10%',
    height: '85%',
    zIndex: '2',
    filter: `drop-shadow(var(--r-${diff}) 0px 0px 3rem)`
});

const SVG_BORDER = (diff) => {
    return ({
        border: `6px solid var(--r-${diff})`
    })
}

const BOT = {
    be: "L0",
    ea: "L2",
    me: "L3",
    ha: 1,
    ad: 5,
    ex: 9
}

const BOT_NAME = {
    be: "IRIS",
    ea: "ELLA",
    me: "PROTO",
    ha: "TWOBIT",
    ad: "KRONOS",
    ex: "LT-79"
}

const BOT_INFO = {
    be: {
        elo: 400
    },
    ea: {
        elo: 800
    },
    me: {
        elo: 1200
    },
    ha: {
        elo: 1600
    },
    ad: {
        elo: 1900
    },
    ex: {
        elo: 2200
    }
}

let retainBgStyle = false;

export default function OfflineMatch(props) {
    const { background } = React.useContext(ThemeContext);
    const [hovered, setHovered] = React.useState(null);

    // * Ready is true when image preloading is finished
    const [ready, setReady] = React.useState(false);
    const goingBackRef = React.useRef(null);

    const triggerBgStyles = (hasEntered, diff) => {
        if (retainBgStyle) {
            return;
        }
        if (goingBackRef.current) {
            return;
        }
        if (hasEntered) {
            background.setStyles({
                opacity: 0.9,
                background: `var(--r-${diff})`,
                backgroundImage: `url(data:image/png;base64,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), url(data:image/png;base64,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),  
                linear-gradient(var(--r-${diff}), var(--r-${diff}))`,
                filter: 'grayscale(0)',
            })
            setHovered(diff);
        } else {
            background.clearStyles();
            setHovered(null);
        }
    }

    React.useEffect(() => {
        // preload images
        function preloadImage(url) {
            var img = new Image();
            img.src = url;
        }

        let preloaders = [__SVG_EASY, __SVG_MEDIUM, __SVG_HARD, __SVG_ADVANCED, __SVG_EXPERT];

        for (let pl of preloaders) {
            preloadImage(pl);
        }

        // * Ready gives permission to bot buttons to load - only once image preloading is done
        setReady(true);
    }, [])

    const backButtonHandler = () => {
        triggerBgStyles(false, "easy");
        goingBackRef.current = true;
        props.changeActivePanel(props.lastPanel[props.lastPanel.length - 1])
    }

    const initiateGame = (opts) => {
        retainBgStyle = true;
        props.initiateGame(opts);
    }

    return (
        <>
            {
                !ready
                ?
                <div className="loader" style={{width: '2rem', height: '2rem', marginLeft: '2%'}}></div> 
                :
                <>
                    <div className='-main-left-button-style-wrapper'>
                        <button className="-main-left-button bold"
                            onClick={() => initiateGame({ type: 'bot', options: { difficulty: BOT.be, diffName: "beginner", botName: BOT_NAME.be } })}
                            onMouseEnter={() => triggerBgStyles(true, "beginner")}
                            onMouseLeave={() => triggerBgStyles(false, "beginner")}>
                            <Svg icon="g_beginner" />
                            BEGINNER
                        </button>
                        <div className='-main-left-button-notch' />
                    </div>
                    <div className='-main-left-button-style-wrapper'>
                        <button className="-main-left-button bold"
                            onClick={() => initiateGame({ type: 'bot', options: { difficulty: BOT.ea, diffName: "easy", botName: BOT_NAME.ea } })}
                            onMouseEnter={() => triggerBgStyles(true, "easy")}
                            onMouseLeave={() => triggerBgStyles(false, "easy")}>
                            <Svg icon="g_easy" />
                            EASY
                        </button>
                        <div className='-main-left-button-notch' />
                    </div>
                    <div className='-main-left-button-style-wrapper'>
                        <button className="-main-left-button bold"
                            onClick={() => initiateGame({ type: 'bot', options: { difficulty: BOT.me, diffName: "medium", botName: BOT_NAME.me } })}
                            onMouseEnter={() => triggerBgStyles(true, "medium")}
                            onMouseLeave={() => triggerBgStyles(false, "medium")}>
                            <Svg icon="g_medium" />
                            MEDIUM
                        </button>
                        <div className='-main-left-button-notch' />
                    </div>
                    <div className='-main-left-button-style-wrapper'>
                        <button className="-main-left-button bold"
                            onClick={() => initiateGame({ type: 'bot', options: { difficulty: BOT.ha, diffName: "hard", botName: BOT_NAME.ha } })}
                            onMouseEnter={() => triggerBgStyles(true, "hard")}
                            onMouseLeave={() => triggerBgStyles(false, "hard")}>
                            <Svg icon="g_hard" />
                            HARD
                        </button>
                        <div className='-main-left-button-notch' />
                    </div>
                    <div className='-main-left-button-style-wrapper'>
                        <button className="-main-left-button bold"
                            onClick={() => initiateGame({ type: 'bot', options: { difficulty: BOT.ad, diffName: "advanced", botName: BOT_NAME.ad } })}
                            onMouseEnter={() => triggerBgStyles(true, "advanced")}
                            onMouseLeave={() => triggerBgStyles(false, "advanced")}>
                            <Svg icon="g_advanced" />
                            ADVANCED
                        </button>
                        <div className='-main-left-button-notch' />
                    </div>
                    <div className='-main-left-button-style-wrapper'>
                        <button className="-main-left-button bold"
                            onClick={() => initiateGame({ type: 'bot', options: { difficulty: BOT.ex, diffName: "expert", botName: BOT_NAME.ex } })}
                            onMouseEnter={() => triggerBgStyles(true, "expert")}
                            onMouseLeave={() => triggerBgStyles(false, "expert")}>
                            <Svg icon="g_expert" />
                            EXPERT
                        </button>
                        <div className='-main-left-button-notch' />
                    </div>
                    <CustomRouter currentRoute={hovered}>
                        <Route route="beginner">
                            <img
                                key={"298375"}
                                src={__R_BEGINNER}
                                style={BOT_IMAGE_STYLES("beginner")}
                            />
                            <img
                                key={"84332"}
                                src={__SVG_BEGINNER}
                                className='-robot-svg'
                                style={{ ...SVG_BORDER('beginner') }}
                            />
                            <div className='-robot-name'>IRIS</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    IRIS.  A repurposed filing assistant, its circuits abuzz with newfound curiosity.  Pawns and rooks replace folders and reports, a delightful confusion in its digital eyes.  Moves are tentative, born from a playful spirit more than strategic intent.  IRIS may not be a master strategist, but its enthusiasm for the game is as contagious as a well-placed knight.
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.be.elo}<br />
                                    <b>Progress:</b> ★★★
                                </div>
                            </div>
                        </Route>
                        <Route route="easy">
                            <img
                                key={"7534263"}
                                src={__R_EASY}
                                style={BOT_IMAGE_STYLES("easy")}
                            />
                            <img
                                key={"26345299"}
                                src={__SVG_EASY}
                                className='-robot-svg'
                                style={{ ...SVG_BORDER('easy') }}
                            />
                            <div className='-robot-name'>ELLA</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    ELLA.  Friendly face of the game, a gentle breeze on the chessboard.  She makes mistakes, sure, but offers a safe space to learn and experiment.  A patient teacher, always ready for a rematch, Ella welcomes you with a digital smile, ready to hone your skills.
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.ea.elo}<br />
                                    <b>Progress:</b> ★★★
                                </div>
                            </div>
                        </Route>
                        <Route route="medium">
                            <img
                                key={"1345723"}
                                src={__R_MEDIUM}
                                style={BOT_IMAGE_STYLES("medium")}
                            />
                            <img
                                key={"2345621"}
                                src={__SVG_MEDIUM}
                                className='-robot-svg'
                                style={{ ...SVG_BORDER('medium') }}
                            />
                            <div className='-robot-name'>PROTO</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    PROTO. A steady learner, gears turning with practiced precision.  No stranger to victory, but no champion either.  It challenges with a calculated calm, a tutor ready to test your skills and learn from yours in return.  A stepping stone on your path to mastery.
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.me.elo}<br />
                                    <b>Progress:</b> ★★★
                                </div>
                            </div>
                        </Route>
                        <Route route="hard">
                            <img
                                key={"346134"}
                                src={__R_HARD}
                                style={BOT_IMAGE_STYLES("hard")}
                            />
                            <img
                                key={"745367435"}
                                src={__SVG_HARD}
                                className='-robot-svg'
                                style={{ ...SVG_BORDER('hard') }}
                            />
                            <div className='-robot-name'>TWOBIT</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    TWOBIT.  Bootstrapped genius, code cobbled from open-source brilliance.  A scrappy underdog, learning with every byte.  It may stumble, but its open architecture fuels relentless improvement.  A tireless challenger, ready to surprise with its unconventional brilliance.
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.ha.elo}<br />
                                    <b>Progress:</b> ★★★
                                </div>
                            </div>
                        </Route>
                        <Route route="advanced">
                            <img
                                key={"923456"}
                                src={__R_ADVANCED}
                                style={BOT_IMAGE_STYLES("advanced")}
                            />
                            <img
                                key={"623451"}
                                src={__SVG_ADVANCED}
                                className='-robot-svg'
                                style={{ ...SVG_BORDER('advanced') }}
                            />

                            <div className='-robot-name'>KRONOS</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    KRONOS. Titan of steel and silicon, forged in the shadow of greatness.  Lays siege to the board, a relentless strategist.  Cracks form in its perfect record, whispers of a superior.  But time, even for machines, is on its side.
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.ad.elo}<br />
                                    <b>Progress:</b> ★★★
                                </div>
                            </div>
                        </Route>
                        <Route route="expert">
                            <img
                                key={"234567"}
                                src={__R_EXPERT}
                                style={BOT_IMAGE_STYLES("expert")}
                            />
                            <img
                                key={"6254577"}
                                src={__SVG_EXPERT}
                                className='-robot-svg'
                                style={{ ...SVG_BORDER('expert') }}
                            />
                            <div className='-robot-name'>LT-79</div>
                            <div className="-robot-details">
                                <div className='-robot-tale'>
                                    LT-79.  A monolith of dented chrome, its single arm a testament to a thousand fallen foes.  Myths whisper of a hundred tournaments, a hundred victories.  Its processors, scarred veterans of a billion calculations, churn with icy precision.  A wounded king, but a king nonetheless, ruling the board with an iron grip.
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.ex.elo}<br />
                                    <b>Progress:</b> ★★★
                                </div>
                            </div>
                        </Route>
                    </CustomRouter>
                </>
            }
            <div className='-main-left-button-style-wrapper back-btn'>
                <button className="-main-left-button" onClick={backButtonHandler}>
                    BACK
                </button>
                <div className='-main-left-button-notch' />
            </div>
        </>
    )
}
