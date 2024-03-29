import React from 'react';
import Svg from '../Svg';
import { SocketContext } from '../../context/SocketContext';
import {URL} from '../../URL.js';

const randomAlphanumericString = (length = 16) => {
    let outp = "", choices = "abcdefghijklmnopqrstuvwxyz1234567890";

    for (let i = 0; i < length; i++) {
        outp += choices.charAt(~~(Math.random() * choices.length));
    }

    return outp;
}

const copyTextToClipboard = text => navigator.clipboard.writeText(text);

function formatMilliseconds(milliseconds) {
    // Convert milliseconds to seconds
    const totalSeconds = Math.floor(milliseconds / 1000);
    
    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format minutes and seconds with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

export default function OnlineMatch(props) {
    const {socket} = React.useContext(SocketContext);

    const [request, setRequest] = React.useState({
        done: false,
        approved: null,
        roomID: null,
        errorMessage: ""
    });

    const [roomTTL, setRoomTTL] = React.useState(600000);
    const TTLTimerRef = React.useRef(null);
    const roomTTLref = React.useRef(null);
    roomTTLref.current = roomTTL;

    React.useEffect(() => {
        let ID = randomAlphanumericString();

        const interpretResponse = (res) => {
            if (!res) {
                return setRequest({
                    done: true,
                    approved: false,
                    roomID: null,
                    errorMessage: <>A network error occurred<br/>Please try again later</>
                })
            }

            if (res.status === "error") {
                return setRequest({
                    done: true,
                    approved: false,
                    roomID: null,
                    errorMessage: res.message
                })
            }

            setRequest({
                done: true,
                approved: true,
                roomID: res.data,
                errorMessage: ""
            });

            TTLTimerRef.current = setInterval(() => {
                setRoomTTL(p => p - 1000);
                if (roomTTLref.current <= 0) {
                    goBackAndDestroyRoom();
                }
            }, 1000);
        }


        socket.emit("create-room", ({
            gameRoomID: ID
        }))

        socket.on("approve-room", interpretResponse);




        return () => {
            clearInterval(TTLTimerRef.current);
            socket.off("approve-room", interpretResponse);
            /*socket.emit("kill-room", ({
                gameRoomID: ID
            }));*/ // u dumb?
        }

    }, [])

    const goBackAndDestroyRoom = () => {
        if (request.roomID) {
            socket.emit("kill-room", ({
                gameRoomID: request.roomID
            }))
        }
        props.changeActivePanel(props.lastPanel[props.lastPanel.length - 1]);
    }

    return (
        <>
            {
                request.done && !request.approved
                &&
                <>
                    <div className='-error' style={{maxWidth: '60%'}}>
                        <div className="-pre">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{height: '2rem', aspectRatio: '1 / 1', fill: '#FF6961'}} viewBox="0 -960 960 960"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>
                        </div>
                        <div className='-over'></div>
                        <div className="-text">
                            {request.errorMessage}
                        </div>
                    </div>
                </>
            }
            {
                request.done && request.approved
                &&
                <>
                    <div className="-room-creation-waiting">
                        Waiting for another player...
                    </div>
                    <div className="-room-creation-link-wrapper">
                        <Svg icon="copy" xs={{cursor: "pointer", margin: "0"}} xClick={() => copyTextToClipboard(`${URL}room/${request.roomID}`)}/>
                        {URL + "room/" + request.roomID}
                    </div>
                    <div className="-room-creation-timer">
                        {roomTTL > 0 && formatMilliseconds(roomTTL)}
                    </div>
                    <div className="loader" style={{height: '2.25rem', marginLeft: '2%'}}></div>
                </>
            }
            <div className='-main-left-button-style-wrapper back-btn'>
                <button className="-main-left-button" onClick={goBackAndDestroyRoom}>
                    CANCEL
                </button>
                <div className='-main-left-button-notch'/>
            </div>
        </>
    )
}
