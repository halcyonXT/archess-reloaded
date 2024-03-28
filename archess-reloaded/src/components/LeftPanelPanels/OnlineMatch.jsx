import React from 'react'
import Svg from '../Svg'

export default function OnlineMatch(props) {
    return (
        <>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold" onClick={() => props.changeActivePanel("room-creation")}>
                    <Svg icon="create" /> 
                    CREATE NEW GAME
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold">
                    <Svg icon="mail" />
                    INVITE FRIEND
                </button>
                <div className='-main-left-button-notch'/>
            </div>
            <div className='-main-left-button-style-wrapper'>
                <button className="-main-left-button bold">
                    <Svg icon="bolt" />
                    QUICK MATCH
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
