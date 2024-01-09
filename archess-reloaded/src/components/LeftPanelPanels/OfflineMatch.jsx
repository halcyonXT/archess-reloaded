import React from 'react'
import Svg from '../Svg'

export default function OfflineMatch(props) {
    return (
        <>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold">
                    <Svg icon="group" />
                    PLAY WITH A FRIEND
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold" onClick={() => props.changeActivePanel("bot-selection")}>
                    <Svg icon="memory" /> 
                    PLAY WITH A BOT
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <div className='-main-left-button-style-wrapper back-btn'>
                <button className="-main-left-button" onClick={() => props.changeActivePanel(props.lastPanel[props.lastPanel.length - 1])}>
                    BACK
                </button>
                <div className='-main-left-button-notch'/>
            </div>
        </>
    )
}
