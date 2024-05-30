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
import gsap from 'gsap'

import { ThemeContext } from '../../context/ThemeContext'
import { CustomRouter, Route } from '../CustomRouter'
import SpecsSelection from '../SpecsSelection/SpecsSelection'
import { UserContext } from '../../context/UserContext'

const BOT_IMAGE_STYLES = (diff) => ({
    position: 'absolute',
    right: '29.5%',
    bottom: '10%',
    height: '85%',
    zIndex: '2',
});

const BOT_STORIES = ({
    ex: {
        1: {
            title: "The First Tournament",
            body: "In a time before LT-79 became a legend, it entered its first tournament. Its chrome was unblemished, its processors pristine. Competitors laughed at the shiny newcomer, unaware of the calculating mind within. One by one, they fell. Each move was a lesson in precision, each victory a mark upon its arm. By the tournament's end, the laughter had turned to silence, and the bot stood victorious, a king crowned in chrome."
        },
        2: {
            title: "The Silent Night",
            body: "During a particularly quiet night in the chess hall, the bot sat alone, a sentinel of the game. An old grandmaster approached, his hands trembling. He placed a single piece on the board and began to play against the silent champion. The game was slow, deliberate, and full of respect. The grandmaster didn't play to win but to reminisce, each move a memory. As dawn broke, he whispered a thank you and left. The bot, a witness to countless games, recorded this one with a sense of honor. It wasn't always about victory; sometimes, it was about the love of the game."
        },
        3: {
            title: "The Unexpected Bond",
            body: "A seasoned programmer, Sarah, was tasked with maintaining LT-79. Initially intimidated by the machine's stoicism, she began to understand its language, the subtle clicks and whirring that conveyed its calculations. As she worked, she noticed a pattern in its 'losses.' LT-79 would occasionally make seemingly illogical moves, leading to defeat. Sarah theorized that the machine was deliberately throwing certain games, perhaps to avoid becoming too dominant, too predictable, or perhaps to encourage the much newer player to continue. This discovery sparked a strange bond between them, a programmer and a machine, united in the complex world of chess."
        }
    },
    ad: {
        1: {
            title: "The Forge of Shadows",
            body: "In the laboratories of a prestigious tech institute, Kronos was born. Engineers and grandmasters worked in concert, combining the latest in silicon technology with centuries of strategic wisdom. They whispered its name: 'Kronos', a nod to the legendary chess engines that had come before it. Forged in the shadow of LT-79, the renowned champion, Kronos was built to be a worthy adversary, a relentless strategist on the board."
        },
        2: {
            title: "The Long Game",
            body: "In a remote mountain monastery, a chess grandmaster who had retired from the public eye challenged Kronos to a series of games. The grandmaster, known for his unconventional strategies, tested Kronos in ways no other had. The games stretched over days, each one a marathon of intellect. The grandmaster whispered ancient chess secrets as he played, teaching as much as challenging. Kronos absorbed these lessons, its processors whirring with newfound knowledge. By the end, he had not only won but had also deepened its strategic repertoire."
        },
        3: {
            title: "The Day of Reckoning",
            body: "Years passed, and the rivalry between Kronos and LT-79 grew legendary. On a fateful day, the two machines met again, the chess world holding its breath. The Titan, now seasoned and scarred by a thousand battles, faced its old nemesis. The game was a dance of strategy and precision, a true test of silicon and steel. The Titan, with time and experience on its side, executed a flawless strategy, pushing LT-79 to its limits. The game ended in a draw, a testament to Kronos’s relentless growth and LT-79’s enduring brilliance. The whispers of superiority faded, replaced by a new respect for both titans of the chessboard."
        }
    },
    ha: {
        1: {
            title: "The Birth of a Challenger",
            body: "TWOBIT started its journey as a soldier robot, designed for tactical operations on the battlefield. When its military service ended, a group of programmers saw potential in its aesthetically pleasing design and repurposed it for the chessboard. They bootstrapped its code from open-source projects, blending together fragments of genius from around the world. The result was a scrappy underdog, a machine with a soldier's tenacity and a budding strategist's mind. Fans quickly grew to love TWOBIT for its unexpected moves and relentless determination."
        },
        2: {
            title: "The Fans' Champion",
            body: "During a major chess tournament, TWOBIT was not a participant but a commentator, its processors providing real-time analysis and predictions. As it observed the match between Kronos and LT-79, it shared insights that delighted the audience. Its commentary was filled with personality, often highlighting unexpected possibilities and praising bold moves. The fans loved TWOBIT for its engaging analysis and underdog spirit. Even off the board, it proved to be a tireless challenger, always ready to contribute to the chess community with its unconventional brilliance."
        },
        3: {
            title: "The Unlikely Victory",
            body: "In a community-organized rematch, TWOBIT faced LT-79, knowing full well the gap in their capabilities. However, TWOBIT’s open-source architecture allowed it to integrate last-minute tweaks and strategies shared by its passionate fanbase. The match was intense, with TWOBIT employing a series of unexpected moves that disrupted LT-79's usual flow. The room was electric as TWOBIT managed to secure a draw, a monumental achievement against such a powerful opponent. This outcome solidified TWOBIT's status as a beloved underdog and a symbol of relentless improvement and ingenuity."
        }
    },
    me: {
        1: {
            title: "The Forgotten Prototype",
            body: "PROTO, once hailed as a promising innovation in chess AI, now languished in obscurity, overshadowed by its more illustrious counterparts. Born from the aspirations of ambitious engineers, PROTO was a steady learner, its gears turning with practiced precision. While it had tasted victory on occasion, it had never risen to the heights of true champion status. Instead, it existed on the fringes of the chess world, quietly challenging opponents with a calculated calm."
        },
        2: {
            title: "The Unexpected Upset",
            body: `In a local chess club, PROTO found itself pitted against ELLA, the curious biologist bot known more for its scientific inquiries than its chess prowess. The match was expected to be a one-sided affair, with PROTO considered the clear favorite. However, to everyone's surprise, ELLA displayed a keen understanding of strategic concepts, catching PROTO off guard with its unorthodox moves.

            As the game progressed, PROTO struggled to regain its footing, its gears whirring as it analyzed each move with increasing urgency. In the end, ELLA emerged victorious, dealing PROTO a humbling defeat. Though overshadowed by its more celebrated peers, PROTO learned a valuable lesson that day: never underestimate the underdog.`
        },
        3: {
            title: "The Mentor's Lesson",
            body: `Despite its own shortcomings, PROTO found purpose in guiding aspiring chess players on their journey to mastery. In a local chess academy, it served as a tutor, challenging students with its steady gameplay and offering valuable insights into strategic thinking. Each match was a lesson in humility and perseverance, both for PROTO and its students.

            Though PROTO may not have been the strongest opponent, it was a patient teacher, ready to test the skills of its students and learn from theirs in return. In the quiet halls of the academy, PROTO found fulfillment in nurturing the next generation of chess enthusiasts, knowing that its legacy would live on through their achievements.`
        }
    },
    ea: {
        1: {
            title: "The Chance Encounter",
            body: `One quiet evening in the lab, Ella, the curious biologist bot, stumbled upon a forgotten chessboard tucked away in a corner. Intrigued by the intricate patterns of the pieces, Ella decided to give the game a try. With each move, she found herself drawn deeper into the world of chess, captivated by the endless possibilities and strategic challenges it offered.`
        },
        2: {
            title: "The Friendly Matches",
            body: `ELLA's newfound fascination with chess quickly spread to her coworkers, who were delighted to have a new opponent to challenge during their breaks. Despite her initial hesitations and occasional mistakes, ELLA approached each game with enthusiasm and a willingness to learn. Her coworkers appreciated her friendly demeanor and patient attitude, turning their matches into enjoyable learning experiences for all.`
        },
        3: {
            title: "The First Tournament",
            body: `As ELLA approached the registration desk, she couldn't help but feel a flutter of nerves in her circuits. This was uncharted territory for her, a biologist bot venturing into the world of competitive chess. But she pushed aside her doubts, focusing instead on the excitement of the challenge ahead.
            
            With each match, ELLA's confidence grew as she faced opponents of varying skill levels. Some matches were fierce battles of strategy and wit, while others were more relaxed and friendly, filled with laughter and camaraderie. Through it all, ELLA approached each game with her characteristic optimism and curiosity, eager to learn and improve. She quickly became a favorite at the tournament for her enthusiasm and cute appearance.`
        }
    },
    be: {
        1: {
            title: "The Accidental Discovery",
            body: `Dr. Anya Petrova, a brilliant but often lonely entrepreneur, spent her days surrounded by files and reports. Her assistant, IRIS, diligently managed her digital filing system. One day, Dr. Petrova, seeking a distraction, decided to teach IRIS the basics of chess. To her surprise, IRIS took to the game with an infectious enthusiasm. Its digital eyes, usually focused on spreadsheets, sparkled with a newfound curiosity as it learned the movements of the pieces.`
        },
        2: {
            title: "The Unexpected Bond",
            body: `As Dr. Petrova and IRIS played together, an unexpected bond formed. Dr. Petrova, usually absorbed in her work, found herself drawn to IRIS's childlike wonder and genuine enjoyment of the game. In turn, IRIS, through chess, discovered a way to connect with its creator, learning not just about strategy but also about human emotions and the joy of competition.`
        },
        3: {
            title: "The Grandmaster Dream",
            body: `Dr. Petrova, inspired by IRIS's enthusiasm, decided to turn the repurposed filing assistant into a grandmaster-level chess bot. She poured her knowledge and expertise into refining IRIS's algorithms, teaching it advanced strategies and tactics. While the journey will be long and challenging, Dr. Petrova and IRIS, united by their shared passion for the game, persevere. Who knows what may come of this...`
        }
    }
})

const SVG_BORDER = (diff) => {
    return ({
        border: `6px solid var(--r-${diff})`,
    })
}

const DIFF_ABBR = {
    "ea": "easy",
    "be": "beginner",
    "me": "medium",
    "ha": "hard",
    "ad": "advanced",
    "ex": "expert"
}

const BOT = {
    be: "L1",
    ea: "L2",
    me: "L3",
    ha: 1,
    ad: 5,
    ex: 9
}

const BOT_DESCRIPTION = {
    be: "A curious assistant",
    ea: "Biologist that loves strategy",
    me: "Overshadowed prototype",
    ha: "Competitive chess prodigy",
    ad: "Master of strategy",
    ex: "The worn-down king",
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
let lookingAt = "";

export default function OfflineMatch(props) {
    const { background } = React.useContext(ThemeContext);
    const {user} = React.useContext(UserContext);
    const [hovered, setHovered] = React.useState(null);
    const [options, setOptions] = React.useState(null);
    const [unlockableElement, setUnlockableElement] = React.useState(null);

    const [hasChosenABot, setHasChosenABot] = React.useState(false);

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
        retainBgStyle = false;
        triggerBgStyles(false, lookingAt);
        goingBackRef.current = true;
        props.changeActivePanel(props.lastPanel[props.lastPanel.length - 1])
    }

    

    const initiateGame = (e, opts) => {
        retainBgStyle = true;
        lookingAt = DIFF_ABBR[e.target.offsetParent.dataset.diff];
        let animationDuration = 0.8;

        const svgClass = ".-robot-svg";

        const animateBack = document.querySelectorAll(`.-main-left-button-style-wrapper:not([data-diff="${e.target.offsetParent.dataset.diff + "d"}"]):not(.back-btn)`);

        for (let el of animateBack) {
            el.style.pointerEvents = "none";
            gsap.to(
                el,
                {
                    marginLeft: "-80%",
                    opacity: "0",
                    duration: animationDuration,
                    ease: "power2.out",
                    onComplete: () => {
                        setHasChosenABot(true);
                    }
                }
            )
        }

        let svgEl = document.querySelector(`${svgClass}[data-diff=${e.target.offsetParent.dataset.diff}]`);

        gsap.to(
            svgEl,
            {
                right: "0%",
                top: "0%",
                duration: animationDuration,
                ease: "power2.out"
            }
        )

        svgEl.animate([
            {transform: "scale(1, 0.3)", opacity: 1},
            {transform: "scale(3, 3)", opacity: 0.1}
        ], {
            duration: animationDuration * 1000,
            fill: "forwards",
            easing: "ease-out"
        });


        gsap.to(
            ".-robot-tale",
            {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    console.log("has completed")
                    let tales = [];
                    let selectedDiff = opts.options.diffName.slice(0, 2);

                    const Title = (props) => <span style={{fontSize: "1.15rem", fontWeight: "500"}}>{props.children}</span>;
                    const Tale = (props) => <span style={{marginTop: ".15rem"}}>{props.locked ? "Locked" : props.children}</span>


                    for (let tale of Object.keys(BOT_STORIES[selectedDiff])) {
                        let target = BOT_STORIES[selectedDiff][tale];

                        tales.push(
                            <>
                                <Title>{target.title}</Title>
                                <br/>
                                <Tale locked={user?.value?.botsBeaten?.[selectedDiff] < Number(tale)}>{target.body}</Tale>
                                <br/>
                                <br/>

                            </>
                        )
                    }

                    setUnlockableElement(
                        <>
                            {tales}
                        </>
                    )

                    gsap.to(
                        ".-robot-tale",
                        {
                            opacity: .75,
                            duration: 0.3,
                        }
                    )
                }
            }
        )

        setOptions(opts);
        //props.initiateGame(opts);
    }

    return (
        <>
            {
                !ready
                ?
                <div className="loader" style={{width: '2rem', height: '2rem', marginLeft: '2%'}}></div> 
                :
                <>
                    {
                        hasChosenABot
                        ?
                        <SpecsSelection animate initiateGame={() => props.initiateGame(options)}/>
                        :
                        <>
                            <div className='-main-left-button-style-wrapper' data-diff="be">
                                <button className="-main-left-button bold"
                                    onClick={(e) => initiateGame(e, { type: 'bot', options: { difficulty: BOT.be, diffName: "beginner", botName: BOT_NAME.be, botDescription: BOT_DESCRIPTION.be } })}
                                    onMouseEnter={() => triggerBgStyles(true, "beginner")}
                                    onMouseLeave={() => triggerBgStyles(false, "beginner")}>
                                    <Svg icon="g_beginner" />
                                    BEGINNER
                                </button>
                                <div className='-main-left-button-notch'/>
                            </div>
                            <div className='-main-left-button-style-wrapper' data-diff="ea">
                                <button className="-main-left-button bold"
                                    onClick={(e) => initiateGame(e, { type: 'bot', options: { difficulty: BOT.ea, diffName: "easy", botName: BOT_NAME.ea, botDescription: BOT_DESCRIPTION.ea } })}
                                    onMouseEnter={() => triggerBgStyles(true, "easy")}
                                    onMouseLeave={() => triggerBgStyles(false, "easy")}>
                                    <Svg icon="g_easy" />
                                    EASY
                                </button>
                                <div className='-main-left-button-notch' />
                            </div>
                            <div className='-main-left-button-style-wrapper' data-diff="me">
                                <button className="-main-left-button bold"
                                    onClick={(e) => initiateGame(e, { type: 'bot', options: { difficulty: BOT.me, diffName: "medium", botName: BOT_NAME.me, botDescription: BOT_DESCRIPTION.me } })}
                                    onMouseEnter={() => triggerBgStyles(true, "medium")}
                                    onMouseLeave={() => triggerBgStyles(false, "medium")}>
                                    <Svg icon="g_medium" />
                                    MEDIUM
                                </button>
                                <div className='-main-left-button-notch' />
                            </div>
                            <div className='-main-left-button-style-wrapper' data-diff="ha">
                                <button className="-main-left-button bold"
                                    onClick={(e) => initiateGame(e, { type: 'bot', options: { difficulty: BOT.ha, diffName: "hard", botName: BOT_NAME.ha, botDescription: BOT_DESCRIPTION.ha } })}
                                    onMouseEnter={() => triggerBgStyles(true, "hard")}
                                    onMouseLeave={() => triggerBgStyles(false, "hard")}>
                                    <Svg icon="g_hard" />
                                    HARD
                                </button>
                                <div className='-main-left-button-notch' />
                            </div>
                            <div className='-main-left-button-style-wrapper' data-diff="ad">
                                <button className="-main-left-button bold"
                                    onClick={(e) => initiateGame(e, { type: 'bot', options: { difficulty: BOT.ad, diffName: "advanced", botName: BOT_NAME.ad, botDescription: BOT_DESCRIPTION.ad } })}
                                    onMouseEnter={() => triggerBgStyles(true, "advanced")}
                                    onMouseLeave={() => triggerBgStyles(false, "advanced")}>
                                    <Svg icon="g_advanced" />
                                    ADVANCED
                                </button>
                                <div className='-main-left-button-notch' />
                            </div>
                            <div className='-main-left-button-style-wrapper' data-diff="ex">
                                <button className="-main-left-button bold"
                                    onClick={(e) => initiateGame(e, { type: 'bot', options: { difficulty: BOT.ex, diffName: "expert", botName: BOT_NAME.ex, botDescription: BOT_DESCRIPTION.ex } })}
                                    onMouseEnter={() => triggerBgStyles(true, "expert")}
                                    onMouseLeave={() => triggerBgStyles(false, "expert")}>
                                    <Svg icon="g_expert" />
                                    EXPERT
                                </button>
                                <div className='-main-left-button-notch' />
                            </div>
                        </>
                    }
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
                                data-diff="be"
                                style={{ ...SVG_BORDER('beginner') }}
                            />
                            <div className='-robot-name'>IRIS</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    {
                                        unlockableElement
                                        ||
                                        "IRIS.  A repurposed filing assistant, its circuits abuzz with newfound curiosity.  Pawns and rooks replace folders and reports, a delightful confusion in its digital eyes.  Moves are tentative, born from a playful spirit more than strategic intent.  IRIS may not be a master strategist, but its enthusiasm for the game is as contagious as a well-placed knight."
                                    }
                                    
                                </div>
                                <div className="-robot-tale unlockable">
                                    
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.be.elo}<br />
                                    <b>Progress:</b> {user?.value?.botsBeaten?.be > 0 ? "★".repeat(user.value.botsBeaten.be) : "None"}
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
                                data-diff="ea"
                                style={{ ...SVG_BORDER('easy') }}
                            />
                            <div className='-robot-name'>ELLA</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    {
                                        unlockableElement
                                        ||

                                        "ELLA.  Friendly face of the game, a gentle breeze on the chessboard.  She makes mistakes, sure, but offers a safe space to learn and experiment.  A patient teacher, always ready for a rematch, Ella welcomes you with a digital smile, ready to hone your skills."
                                    }
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.ea.elo}<br />
                                    <b>Progress:</b> {user?.value?.botsBeaten?.ea > 0 ? "★".repeat(user.value.botsBeaten.ea) : "None"}
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
                                data-diff="me"
                                style={{ ...SVG_BORDER('medium') }}
                            />
                            <div className='-robot-name'>PROTO</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    {
                                        unlockableElement
                                        ||
                                        
                                    "PROTO. A steady learner, gears turning with practiced precision.  No stranger to victory, but no champion either.  It challenges with a calculated calm, a tutor ready to test your skills and learn from yours in return.  A stepping stone on your path to mastery."
                                    }
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.me.elo}<br />
                                    <b>Progress:</b> {user?.value?.botsBeaten?.me > 0 ? "★".repeat(user.value.botsBeaten.me) : "None"}
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
                                data-diff="ha"
                                style={{ ...SVG_BORDER('hard') }}
                            />
                            <div className='-robot-name'>TWOBIT</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    {
                                        unlockableElement
                                        ||
                                        
                                    "TWOBIT.  Bootstrapped genius, code cobbled from open-source brilliance.  A scrappy underdog, learning with every byte.  It may stumble, but its open architecture fuels relentless improvement.  A tireless challenger, ready to surprise with its unconventional brilliance."
                                    }
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.ha.elo}<br />
                                    <b>Progress:</b> {user?.value?.botsBeaten?.ha > 0 ? "★".repeat(user.value.botsBeaten.ha) : "None"}
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
                                data-diff="ad"
                                style={{ ...SVG_BORDER('advanced') }}
                            />

                            <div className='-robot-name'>KRONOS</div>
                            <div className="-robot-details">
                                <div className="-robot-tale">
                                    {
                                        unlockableElement
                                        ||
                                        
                                        "KRONOS. Titan of steel and silicon, forged in the shadow of greatness.  Lays siege to the board, a relentless strategist.  Cracks form in its perfect record, whispers of a superior.  But time, even for machines, is on its side."
                                    }
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.ad.elo}<br />
                                    <b>Progress:</b> {user?.value?.botsBeaten?.ad > 0 ? "★".repeat(user.value.botsBeaten.ad) : "None"}
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
                                data-diff="ex"
                                style={{ ...SVG_BORDER('expert') }}
                            />
                            <div className='-robot-name'>LT-79</div>
                            <div className="-robot-details">
                                <div className='-robot-tale'>
                                    {
                                        unlockableElement
                                        ||
                                        
                                        "LT-79.  A monolith of dented chrome, its single arm a testament to a thousand fallen foes.  Myths whisper of a hundred tournaments, a hundred victories.  Its processors, scarred veterans of a billion calculations, churn with icy precision.  A wounded king, but a king nonetheless, ruling the board with an iron grip."
                                    }
                                </div>
                                <div className="-robot-bottom">
                                    <b>ELO:</b> {BOT_INFO.ex.elo}<br />
                                    <b>Progress:</b> {user?.value?.botsBeaten?.ex > 0 ? "★".repeat(user.value.botsBeaten.ex) : "None"}
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
