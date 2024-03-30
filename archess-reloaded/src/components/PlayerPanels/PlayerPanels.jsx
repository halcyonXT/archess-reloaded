import React from 'react'
import { GameContext } from '../../context/GameContext'
import { UserContext } from '../../context/UserContext';
import './PlayerPanels.css'
import { SubscriptionContext } from '../../context/SubscriptionContext';

const DEFAULT_PFP_URL = "https://i.ibb.co/g4Gr8wv/default-pfp.png";

export default function PlayerPanels(props) {
    const {game} = React.useContext(GameContext);
    const {user} = React.useContext(UserContext);
    const {subscribers} = React.useContext(SubscriptionContext);


    React.useEffect(() => {
        console.log("detecting update")

        game.set(p => {
            let outp = {...p};
            outp.opponent = {
                ...outp.opponent,
                ...subscribers.value[outp.opponent.sid]
            }
            return outp;
        })

    }, [subscribers.value])

    console.log(subscribers);
    console.log(game.value);


    if (props.side === "left") {
        return (
            <div className="-ppanel -left-player">
                <div className="-lp-details-wrap">
                    <div style={{backgroundImage: props.pBgs.left.col}} className="-lp-bg-bg">
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
        )
    }

    if (props.side === "right") {
        return (
            <div className="-ppanel -right-player">
                <div className="-rp-profile">
                    <div className="-rp-profile-username">
                        {
                            game.value.opponent.username
                        }
                    </div>
                </div>
                <div style={{backgroundImage: props.pBgs.right.col}} className="-rp-bg-bg">
                    <div className='-rp-bg'></div>
                </div>
                <div className="-rp-bg-pfp">
                    {
                        game.value.type === 'bot'
                        ?
                        <img
                            className='-bot-pfp'
                            src={props.pBgs.right.pfp}
                        />
                        :
                        <img
                            className='-pl-pfp'
                            src={
                                !game.value.opponent.profilePicture
                                ?
                                DEFAULT_PFP_URL
                                :
                                game.value.opponent.profilePicture
                            }
                        />
                    }
                </div>
                
            </div>
        )
    }
}
