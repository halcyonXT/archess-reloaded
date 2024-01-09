import React from 'react'
import Svg from '../Svg'
import __R_BEGINNER from '../../assets/robot-beginner.webp'
import __R_EASY from '../../assets/robot-easy.webp'
import __R_MEDIUM from '../../assets/robot-medium.webp'
import __R_HARD from '../../assets/robot-hard.webp'
import __R_ADVANCED from '../../assets/robot-advanced.webp'
import { ThemeContext } from '../../context/ThemeContext'
import { CustomRouter, Route } from '../CustomRouter'

const BOT_IMAGE_STYLES = {
    position: 'absolute', 
    right: '13.5%', 
    bottom: '10%', 
    height: '80%'
};

export default function OfflineMatch(props) {
    const {background} = React.useContext(ThemeContext);
    const [hovered, setHovered] = React.useState(null);

    const triggerBgStyles = (hasEntered, diff) => {
        if (hasEntered) {
            background.setStyles({
                backgroundImage: `radial-gradient(circle at 100% 100%, var(--r-${diff}), var(--main) 50%)`,
                filter: 'grayscale(0)'
            })
            setHovered(diff)
        } else {
            background.clearStyles()
            setHovered(null);
        }
    }

    return (
        <>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold" 
                    onMouseEnter={() => triggerBgStyles(true, "beginner")}
                    onMouseLeave={() => triggerBgStyles(false, "beginner")}>
                    <Svg icon="g_beginner" />
                    BEGINNER
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold" 
                    onMouseEnter={() => triggerBgStyles(true, "easy")}
                    onMouseLeave={() => triggerBgStyles(false, "easy")}>
                    <Svg icon="g_easy" />
                    EASY
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold" 
                    onMouseEnter={() => triggerBgStyles(true, "medium")}
                    onMouseLeave={() => triggerBgStyles(false, "medium")}>
                    <Svg icon="g_medium" />
                    MEDIUM
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold" 
                    onMouseEnter={() => triggerBgStyles(true, "hard")}
                    onMouseLeave={() => triggerBgStyles(false, "hard")}>
                    <Svg icon="g_hard" />
                    HARD
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold" 
                    onMouseEnter={() => triggerBgStyles(true, "advanced")}
                    onMouseLeave={() => triggerBgStyles(false, "advanced")}>
                    <Svg icon="g_advanced" />
                    ADVANCED
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <CustomRouter currentRoute={hovered}>
                <Route route="beginner">
                    <img
                        key={"298375"}
                        src={__R_BEGINNER}
                        style={BOT_IMAGE_STYLES}
                    />
                </Route>
                <Route route="easy">
                    <img
                        key={"7534263"}
                        src={__R_EASY}
                        style={BOT_IMAGE_STYLES}
                    />
                </Route>
                <Route route="medium">
                    <img
                        key={"1345723"}
                        src={__R_MEDIUM}
                        style={BOT_IMAGE_STYLES}
                    />
                </Route>
                <Route route="hard">
                    <img
                        key={"346134"}
                        src={__R_HARD}
                        style={BOT_IMAGE_STYLES}
                    />
                </Route>
                <Route route="advanced">
                    <img
                        key={"923456"}
                        src={__R_ADVANCED}
                        style={BOT_IMAGE_STYLES}
                    />
                </Route>
            </CustomRouter>
            <div className='-main-left-button-style-wrapper back-btn'>
                <button className="-main-left-button" onClick={() => props.changeActivePanel(props.lastPanel[props.lastPanel.length - 1])}>
                    BACK
                </button>
                <div className='-main-left-button-notch'/>
            </div>
        </>
    )
}
