import React, { createContext, useEffect } from 'react';
import { getUserInfo } from '../api/api';

const UserContext = createContext();

const DEFAULT_USER = ({
    _requestMade: {
        done: true,
        proceed: true,
        message: ""
    },
    _id: null,
    loggedIn: false,
    name: "Guest",
    profilePicture: null
})



const UserContextProvider = ({ children }) => {
    const [FRP, setFRP] = React.useState("sign-up");

    const [user, setUser] = React.useState({
        _requestMade: {
            done: false,
            proceed: false,
            message: ""
        },
        loggedIn: false,
        _id: null,
        name: "Guest",
        profilePicture: null
    })

    const userFetchDecoder = (response) => {
        let returner = (proceed, message) => ({proceed, message});
    
        if (response?.status === "error") {
            switch (response?.error) {
                case "unauthorized":
                    return returner(true, "User is not logged in");
                case "network-error":
                    return returner(false, <>A network error has occurred<br/><u onClick={userInfoFetch} style={{cursor: 'pointer'}}>Click here to retry</u></>);
                default:
                    return returner(false, "Ambiguous error");
            }
        }
    
        return returner(true, "Success")
    }

    let userInfoFetch = async() => {
        let res = await getUserInfo();
        let {proceed, message} = userFetchDecoder(res);

        setUser(p => ({...p, _requestMade: {done: false, proceed: false, message: ""}}));

        if (proceed) {
            if (res?.status === "error") {
                setUser({...DEFAULT_USER});
            } else {
                // TODO - Gotten correct user info
            }
        } else {
            setUser(p => {
                let m = {...p};
                m._requestMade = {
                    done: true,
                    proceed,
                    message
                };
                return m;
            })
        }
    }

    React.useEffect(() => {
        userInfoFetch();
    }, []);



    return (
        <UserContext.Provider value={{
            user: {
                value: user,
                set: setUser
            },
            DEFAULT_PFP_URL: "https://i.ibb.co/g4Gr8wv/default-pfp.png",

            // * Upon entering the Registration component, which panel to render first
            // * This is a workaround because of a sudden change in plans
            __forceRegistrationPanel: {
                value: FRP,
                set: setFRP
            }
        }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContextProvider, UserContext }