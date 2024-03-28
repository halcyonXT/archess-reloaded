import React from 'react'
import './App.css'
import __BACKGROUND_WEBP from "./assets/bg-webp.webp"
import { ThemeContext } from './context/ThemeContext'
import { useIsMount } from './hooks/useIsMount'
import LeftPanel from './components/LeftPanel'
import { gsap } from 'gsap';
import { GameContext } from './context/GameContext'
import Chessboard from './components/Chessboard/Chessboard'
import __R_BEGINNER from './assets/robot-beginner.webp'
import __R_EASY from './assets/robot-easy.webp'
import __R_MEDIUM from './assets/robot-medium.webp'
import __R_HARD from './assets/robot-hard.webp'
import __R_ADVANCED from './assets/robot-advanced.webp'
import __R_EXPERT from './assets/robot-expert.webp'
import { UserContext } from './context/UserContext'
import { CustomRouter, Route } from './components/CustomRouter'
import Registration from './components/Registration/Registration'
import __AR from './assets/archess-webp.webp'
import __AR_INV from './assets/archess-inverted-webp.webp'
import CommunityPanel from './components/CommunityPanel/CommunityPanel'
import { SocketContext } from './context/SocketContext'


let vantaReference = null;

const DEFAULT_PFP_URL = "https://i.ibb.co/g4Gr8wv/default-pfp.png";

const getBgWithNoise = (bg) => `url(data:image/png;base64,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), url(data:image/png;base64,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),
${bg}`;

const DEFAULT_OPPONENT = ({
    _id: null,
    isBot: true,
    name: null,
    profilePicture: null,
    background: null
})

let currentRadialTransitionDuration = 1.5;

let radialGradientLastTo = "-75%";
function App() {
    const {theme, setTheme, background} = React.useContext(ThemeContext);
    
    const {game} = React.useContext(GameContext);

    const {user} = React.useContext(UserContext);

    const {socket} = React.useContext(SocketContext)

    const [opponent, setOpponent] = React.useState({...DEFAULT_OPPONENT});

    const [mainPanel, setMainPanel] = React.useState(null);

    const [performanceModeEnabled, setPerformanceModeEnabled] = React.useState(!!localStorage.getItem("archess-performance"))

    const [pBgs, setPBgs] = React.useState({
        left: {
            col: getBgWithNoise("linear-gradient(var(--inv), var(--inv))"),
            pfp: null
        },
        right: {
            col: getBgWithNoise("linear-gradient(var(--inv), var(--inv))"),
            pfp: null
        }
    })

    const backgroundRef = React.useRef(null);
    const mainRef = React.useRef(null);
    const radialGradientRef = React.useRef(null);
    const vantaReferenceRef = React.useRef(null);

    const initiateVanta = () => {
        vantaReferenceRef.current = VANTA.NET({
            el: "#root",
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1,
            scaleMobile: 1.00,
            color: theme === "dark" ? 0xffffff : 0x0,
            backgroundColor: theme === "dark" ? 0x0 : 0xffffff
        })
    }
    
    React.useEffect(() => {
        socket.emit("client-init", ({
            url: document.location.pathname
        }))

        if (!performanceModeEnabled) {
            initiateVanta();
        }

        function preloadImage(url) {
            var img = new Image();
            img.src = url;
        }

        let preloaders = [__AR, __AR_INV, __R_BEGINNER, __R_EASY, __R_MEDIUM, __R_HARD, __R_ADVANCED, __R_EXPERT];

        for (let pl of preloaders) {
            preloadImage(pl);
        }
    }, [])

    React.useEffect(() => {
        if (vantaReferenceRef.current) {
            vantaReferenceRef.current.setOptions({
                color: theme === "dark" ? 0xffffff : 0x0,
                backgroundColor: theme === "dark" ? 0x0 : 0xffffff
            })
        }
    }, [theme]);

    const initiateRadialGradientTransition = (duration = null, to = "-75%") => {
        let TRANSITION_DURATION = duration === "default" ? 1.5 : duration ?? 1.5;
        currentRadialTransitionDuration = TRANSITION_DURATION;

        radialGradientLastTo = to;

        try {

            document.querySelector('.-main-left').style.pointerEvents = 'none';
        } catch (ex) {
            console.warn(ex);
        }

        gsap.fromTo(
            document.querySelector('.-main-left'),
            {
                // ! From
                opacity: "1",
            },
            {
                // ! To
                opacity: "0",
                duration: TRANSITION_DURATION * 0.75,
            }
        );


        gsap.fromTo(
            radialGradientRef.current,
            {
                // ! From
                right: '0%'
            },
            {
                // ! To
                right: to,
                ease: 'power2.out',
                duration: TRANSITION_DURATION,
            }
        );
    }

    const initiateReverseRadialGradientTransition = (duration = null) => {
        let TRANSITION_DURATION = duration ?? 1.5;
        currentRadialTransitionDuration = TRANSITION_DURATION;

        gsap.fromTo(
            document.querySelector('.-main-left'),
            {
                // ! From
                opacity: "0",
            },
            {
                // ! To
                opacity: "1",
                duration: TRANSITION_DURATION * 0.75,
                ease: 'power2.out',
            }
        );
        gsap.fromTo(
            radialGradientRef.current,
            {
                // ! From
                //right: '-75%',
                right: radialGradientLastTo,
            },
            {
                // ! To
                right: '0%',
                duration: TRANSITION_DURATION,
                ease: 'power1.out',
            }
        );

        setTimeout(() => {
            try {
                document.querySelector('.-main-left').style.pointerEvents = 'all';
            } catch (ex) {
                console.warn(ex);
            }
        }, TRANSITION_DURATION * 1000);
    }

    /**
     * Will trigger Chessboard component rendering and animations that come with that trigger. Check GameContext for options
     * @param {String} opts - Check GameContext
     */
    const initiateGame = (opts) => {
        const TRANSITION_DURATION = 1; // * in seconds

        if (TRANSITION_DURATION != currentRadialTransitionDuration) {
            currentRadialTransitionDuration = TRANSITION_DURATION;
        }

        if (opts.type === "new-room") {
            initiateRadialGradientTransition();
        }

        if (opts.type === 'bot') {
            // * <TRANSITION>
            initiateRadialGradientTransition();

            let botPfp = null

            switch (opts.options.diffName) {
                case "beginner":
                    botPfp = __R_BEGINNER;
                    break;
                case "easy":
                    botPfp = __R_EASY;
                    break;
                case "medium":
                    botPfp = __R_MEDIUM;
                    break;
                case "hard":
                    botPfp = __R_HARD;
                    break;
                case "advanced":
                    botPfp = __R_ADVANCED;
                    break;
                case "expert":
                    botPfp = __R_EXPERT;
                    break;
            }


            setPBgs(p => ({
                ...p,
                right: {
                    col: getBgWithNoise(`linear-gradient(var(--r-${opts.options.diffName}), var(--r-${opts.options.diffName}))`),
                    pfp: botPfp
                }
            }))

            setOpponent({
                _id: null,
                isBot: true,
                name: opts.options.botName,
                profilePicture: null,
                background: null
            })

            setTimeout(() => {

                // TODO - Write a more complex parser
                game.set(prev => ({...prev, started: true, type: opts.type, options: opts.options}))
            }, TRANSITION_DURATION * 1000)
            
        } 

        // * </TRANSITION>

        // * Timeout awaiting animation finish
        
    }

    const switchMainPanel = (panelName, opts) => {
        if (panelName) {
            if (opts?.to) {
                initiateRadialGradientTransition("default", opts.to);
            } else {
                initiateRadialGradientTransition();
            }
        } else {
            initiateReverseRadialGradientTransition();
        }

        setTimeout(() => {
            setMainPanel(panelName);
        }, currentRadialTransitionDuration * 1000);
        
        /*setTimeout(() => {
            setMainPanel(null);
            initiateReverseRadialGradientTransition();
        }, currentRadialTransitionDuration * 3 * 1000)*/
    }

    const togglePerformance = () => {
        setPerformanceModeEnabled(p => !p)
        
    }
    
    React.useEffect(() => {
        if (!performanceModeEnabled) {
            localStorage.setItem("archess-performance", "");
            setPerformanceModeEnabled(false);
            vantaReferenceRef.current.destroy();
            vantaReferenceRef.current = null
        } else {
            localStorage.setItem("archess-performance", "1");
            setPerformanceModeEnabled(true);
            if (!vantaReferenceRef.current) {
                initiateVanta();
            }
        }
    }, [performanceModeEnabled]);


    return (
        <>
            <div className='-theme-select-wrapper'>
                <div className="-theme-select">
                    <div className='flex flex-center pointer' onClick={() => setTheme("dark")}>
                        <div className={`-ts-square ${theme === "dark" ? "enabled" : ""}`}></div>
                        <div>DARK</div>
                    </div>
                    <div className='flex flex-center pointer' onClick={() => setTheme("light")}>
                        <div className={`-ts-square ${theme === "light" ? "enabled" : ""}`}></div>
                        <div>LIGHT</div>
                    </div>
                    <div className='flex flex-center pointer' onClick={togglePerformance}>
                        <div className={`-ts-square ${!performanceModeEnabled ? "enabled" : ""}`}></div>
                        <div>PERFORMANCE</div>
                    </div>
                </div>
                <div className="-theme-select-notch"></div>
            </div>
            <div className='-background-main' ref={backgroundRef} style={background.styles}></div>
            <div className='-rmain' ref={mainRef}>
                <div className="-main" ref={radialGradientRef}></div>
                <CustomRouter currentRoute={mainPanel}>
                    <Route route="registration">
                        <Registration switchMainPanel={switchMainPanel}/>
                    </Route>
                    <Route route="community">
                        <CommunityPanel switchMainPanel={switchMainPanel}/>
                    </Route>
                </CustomRouter>
                {
                    // ! If the game hasn't started, render the main menu, aka the LeftPanel
                    // ! If there is a mainPanel active, also don't render LeftPanel
                    (!game.value.started || mainPanel)
                    &&
                    <LeftPanel 
                        initiateGame={initiateGame} 
                        initiateRadialGradientTransition={initiateRadialGradientTransition}
                        setMainPanel={switchMainPanel}/>
                }
                {
                    // ! If the game has started, render the chessboard. The chessboard component gets info from GameContext
                    game.value.started
                    &&
                    <>
                        <div className="-ppanel -left-player">
                            <div className="-lp-details-wrap">
                                <div style={{backgroundImage: pBgs.left.col}} className="-lp-bg-bg">
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
                            </div>
                        </div>
                        <Chessboard/>
                        <div className="-ppanel -right-player">
                            <div style={{backgroundImage: pBgs.right.col}} className="-rp-bg-bg">
                                <div className='-rp-bg'></div>
                            </div>
                            <div className="-rp-bg-pfp">
                                {
                                    game.value.type === 'bot'
                                    &&
                                    <img
                                        src={pBgs.right.pfp}
                                    />
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default App


