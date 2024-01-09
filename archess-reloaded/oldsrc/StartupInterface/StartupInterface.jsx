import React from 'react'
import __CHESS_PHOTO from "../assets/chessphoto.jpg"
import './StartupInterface.css'
import __ARCHESS_PHOTO from "../assets/archess.webp"
import { ICONS } from '../Icons'

export default function StartupInterface(props) {
    return (
        <>
            <div className="-si-half -si-top">
                <div className="-si-half-content">
                    <div className="-si-half-top-left">
                        <img
                            className='-si-half-top-left-image'
                            src={__ARCHESS_PHOTO}
                        />
                    </div>
                    <div className="-si-half-top-right">
                        <button onClick={() => props.initiateGame("quick")} disabled={!props.user.loggedIn} className={`-si-half-top-right-button -button-normal`}>
                            <div className='-si-half-top-right-button-content'>
                                <div className="-si-half-top-right-button-icon -fill-font -icon-80">
                                    { ICONS.search_globe }
                                </div>
                                <div className='-si-half-top-right-button-texts'>
                                    <div className="-si-half-top-right-button-texts-top">
                                        Quick match
                                    </div>
                                    <div className="-si-half-top-right-button-texts-bottom">
                                        Pair up and play against an opponent of a similar rating
                                    </div>
                                </div>
                            </div>
                        </button>
                        <button onClick={() => props.initiateGame("local")} className="-si-half-top-right-button -button-normal">
                            <div className='-si-half-top-right-button-content'>
                                <div className="-si-half-top-right-button-icon -fill-font -icon-80">
                                    { ICONS.chess }
                                </div>
                                <div className='-si-half-top-right-button-texts'>
                                    <div className="-si-half-top-right-button-texts-top">
                                        Play locally
                                    </div>
                                    <div className="-si-half-top-right-button-texts-bottom">
                                        Start an offline game on your computer
                                    </div>
                                </div>
                            </div>
                        </button>
                        <button onClick={() => props.initiateGame("private")} className="-si-half-top-right-button -button-normal">
                            <div className='-si-half-top-right-button-content'>
                                <div className="-si-half-top-right-button-icon -fill-font -icon-80">
                                    { ICONS.friend }
                                </div>
                                <div className='-si-half-top-right-button-texts'>
                                    <div className="-si-half-top-right-button-texts-top">
                                        Play against a friend
                                    </div>
                                    <div className="-si-half-top-right-button-texts-bottom">
                                        Create a private room to play with your friend
                                    </div>
                                </div>
                            </div>
                        </button>
                        <button onClick={() => props.initiateGame("bot")} className="-si-half-top-right-button -button-normal">
                            <div className='-si-half-top-right-button-content'>
                                <div className="-si-half-top-right-button-icon -fill-font -icon-80">
                                    { ICONS.bot }
                                </div>
                                <div className='-si-half-top-right-button-texts'>
                                    <div className="-si-half-top-right-button-texts-top">
                                        Play against a bot
                                    </div>
                                    <div className="-si-half-top-right-button-texts-bottom">
                                        Practice your skills against a bot
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
            <div className="-si-half -si-bottom">
                <div className="-si-half-content absolute"></div>
                <img 
                    className='-si-bottom-overlay -si-bottom-overlay-image'
                    src={__CHESS_PHOTO}
                />
                <div className="-si-bottom-overlay -si-bottom-overlay-color">

                </div>
            </div>
        </>
    )
}
