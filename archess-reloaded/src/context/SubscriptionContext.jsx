import React, { createContext, useEffect } from 'react';
import { SocketContext } from './SocketContext';
import { getTargetUserInfo } from '../api/api';

const SubscriptionContext = createContext();

const DEFAULT_OPPONENT = () => ({
    _id: null,
    username: null,
    profilePicture: null,
    background: null
})

const SubscriptionContextProvider = ({ children }) => {
    const {socket} = React.useContext(SocketContext);

    const [subscribers, setSubscribers] = React.useState({
    
    })

    const updateSubscriber = async (sid, uid) => {
        let data;

        if (uid) {
            data = await getTargetUserInfo(uid);

            if (data?.status !== "error") {
                setSubscribers(p => {
                    let outp = {...p};
                    outp[sid] = data.data; // * wow
                    return outp;
                })
            }

        }

    }

    React.useEffect(() => {
        const callUpdate = (res) => {
            if (res.sid) {
                updateSubscriber(res.sid, res.id);
            }
        }

        socket.on("update-subscriber", callUpdate);

        return () => {
            socket.off("update-subscriber", callUpdate);
        }
    }, [])


    return (
        <SubscriptionContext.Provider value={{
            subscribers: {
                value: subscribers,
                set: setSubscribers
            },
            updateSubscriber
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export { SubscriptionContextProvider, SubscriptionContext }