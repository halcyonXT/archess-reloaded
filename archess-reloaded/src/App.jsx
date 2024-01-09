import React from 'react'
import './App.css'
import __BACKGROUND_WEBP from "./assets/bg-webp.webp"
import { ThemeContext } from './context/ThemeContext'
import { useIsMount } from './hooks/useIsMount'
import LeftPanel from './components/LeftPanel'

let vantaReference = null;

function App() {
    const {theme, setTheme, background} = React.useContext(ThemeContext);

    const isMounted = useIsMount();
    
    React.useEffect(() => {
        vantaReference = VANTA.NET({
            el: "#root",
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: theme === "dark" ? 0xffffff : 0x0,
            backgroundColor: theme === "dark" ? 0x0 : 0xffffff
        })
    }, [])

    React.useEffect(() => {
        if (vantaReference) {
            vantaReference.setOptions({
                color: theme === "dark" ? 0xffffff : 0x0,
                backgroundColor: theme === "dark" ? 0x0 : 0xffffff
            })
        }
    }, [theme])

    return (
        <>
            {/*<div className='-frame-component top'></div>
            <div className='-frame-component left'></div>
            <div className='-frame-component right'></div>
            <div className='-frame-component bottom'></div>*/}
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
                </div>
                <div className="-theme-select-notch"></div>
            </div>
            <div className='-background-main' style={background.styles}></div>
            <div className='-main'>
                <LeftPanel/>
            </div>
        </>
    )
}

export default App
