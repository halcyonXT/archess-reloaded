import React from 'react'
import __LOGO_INV_WEBP from "../assets/archess-inverted-webp.webp"
import __LOGO_WEBP from "../assets/archess-webp.webp"
import { ThemeContext } from '../context/ThemeContext'
import './LeftPanel.css'
import MainMenu from './LeftPanelPanels/MainMenu'
import OfflineMatch from './LeftPanelPanels/OfflineMatch'
import { CustomRouter, Route } from "./CustomRouter"
import BotSelection from './LeftPanelPanels/BotSelection'
import UserInfo from './UserInfo'

const ANIMATION_STAGGER = 50; // ! in miliseconds

let TIMEOUT = null;
export default function LeftPanel(props) {
    const {theme} = React.useContext(ThemeContext)
    const buttonWrapperRef = React.useRef(null);

    const [lastPanel, setLastPanel] = React.useState([]);
    const lastPanelRef = React.useRef(null);
    lastPanelRef.current = lastPanel;

    const [activePanel, setActivePanel] = React.useState("main-menu");

    const changeActivePanel = (targetPanel) => {
        if (TIMEOUT) return;
        
        const PANEL_LIST = ["main-menu", "bot-selection", "offline-match"];
        let isBackButton = false;

        if (targetPanel === lastPanelRef.current[lastPanelRef.current.length - 1]) {
            isBackButton = true;
            setLastPanel(prev => {
                let outp = [...prev];
                outp.pop();
                return outp;
            })
        }
        if (!PANEL_LIST.includes(targetPanel)) return console.warn("LeftPanel - changeActivePanel(...): Target panel is not part of PANEL_LIST")

        for (let i in buttonWrapperRef.current.children) {
            try {
                buttonWrapperRef.current.children[i].animate([
                    {transform: 'translateX(0)', opacity: 1},
                    {transform: 'translateX(-2rem)', opacity: 0},
                ], {
                    duration: 200,
                    delay: i * ANIMATION_STAGGER,
                    easing: 'ease-in',
                    fill: 'forwards'
                })
            } catch (ex) {
                /*console.warn(`LeftPanel staggered animation error:
                iterator: ${i}
                buttonWrapperRef.children.length: ${buttonWrapperRef.current.children.length}
                TTL: ${200 + (buttonWrapperRef.current.children.length * ANIMATION_STAGGER)}
                activeItem: ${buttonWrapperRef.current.children[i]}
                exception: ${ex}`)*/
            }
        }
        
        TIMEOUT = setTimeout(() => {
            if (!lastPanelRef.current.includes(targetPanel)) {
                if (!isBackButton) {
                    setLastPanel(prev => [...prev, activePanel]);
                }
            }
            setActivePanel(targetPanel);
            clearTimeout(TIMEOUT);
            TIMEOUT = null;
        }, 200 + (buttonWrapperRef.current.children.length * ANIMATION_STAGGER))
    }
    
    return (
        <div className="-main-left">
            <img 
                src={__LOGO_INV_WEBP}
                style={theme === "dark" ? {} : {filter: "invert(1)"}}
                className="-main-left-logo" />
            <div className='-main-left-button-wrapper' ref={buttonWrapperRef}>
                <CustomRouter currentRoute={activePanel}>
                    <Route route="main-menu">
                        <MainMenu 
                            changeActivePanel={changeActivePanel}
                            lastPanel={lastPanelRef.current} />
                    </Route>
                    <Route route="offline-match">
                        <OfflineMatch 
                            changeActivePanel={changeActivePanel}
                            lastPanel={lastPanelRef.current} />
                    </Route>
                    <Route route="bot-selection">
                        <BotSelection 
                            changeActivePanel={changeActivePanel}
                            lastPanel={lastPanelRef.current} 
                            initiateGame={props.initiateGame}/>
                    </Route>
                </CustomRouter>
            </div>
            <UserInfo initiateRadialGradientTransition={props.initiateRadialGradientTransition} setMainPanel={props.setMainPanel}/>
        </div>
    )
}

/**
 * <img 
                src={theme === "dark" ? __LOGO_INV_WEBP : __LOGO_WEBP}
                className="-main-left-logo" />
 */
