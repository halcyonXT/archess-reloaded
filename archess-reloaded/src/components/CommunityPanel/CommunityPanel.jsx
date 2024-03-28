import React from 'react'
import './CommunityPanel.css'
import UserInfo from '../UserInfo'
import Svg from '../Svg'

export default function CommunityPanel(props) {
    return (
        <div className='-community'>
            <div className='-community-boards-wrapper'>
                <div className="-community-boards">
                    <div className="-community-boards-header">
                        BOARDS:
                    </div>
                    <div className="-community-boards-list">
                        <BoardItem name="Announcements" icon="announce" />
                        <BoardItem name="Bug report" icon="bug" />
                        <BoardItem name="General Discussion" icon="chat" />
                        <BoardItem name="Strategy" icon="strategy" />
                        <BoardItem name="Off-topic" icon="topic" />
                    </div>
                </div>
                <UserInfo community setMainPanel={props.switchMainPanel} xs={{minWidth: '100%'}}/>
            </div>
            <div className="-community-main-panel">
                <div className="-community-main-panel-navbar">
                    <div className="-community-main-panel-navbar-input-wrapper">
                        <Svg icon="search" xs={{margin: "0 0.25rem"}}/>
                        <input 
                            type="text" 
                            placeholder='Search boards, users, games...'
                            className="-community-main-panel-navbar-input" />
                    </div>
                </div>
            </div>
        </div>
    )
}

const BoardItem = (props) => {
    return (
        <div className="-community-boards-list-item">
            <div className="-community-boards-list-item-text">
                <Svg icon={props.icon}/>
                {props.name}
            </div>
            <div className="-community-boards-list-item-notch"></div>
        </div>
    )
}
