import React from 'react'
import Svg from '../Svg'

export default function MainMenu(props) {
    return (
        <>
            <div className='-main-left-button-style-wrapper'>
                    <button className="-main-left-button bold" onClick={() => props.changeActivePanel("online-match")}>
                        <Svg icon="globe_search" />
                        ONLINE MATCH
                    </button>
                    <div className='-main-left-button-notch'/>
                </div>
                <div className='-main-left-button-style-wrapper'>
                    <button className="-main-left-button bold" onClick={() => props.changeActivePanel("offline-match")}>
                        <Svg icon="play" />
                        OFFLINE MATCH
                    </button>
                    <div className='-main-left-button-notch'/>
                </div>
                <div className='-main-left-button-style-wrapper'>
                    <button className="-main-left-button">
                        OPTIONS
                    </button>
                    <div className='-main-left-button-notch'/>
                </div>
        </>
    )
}
