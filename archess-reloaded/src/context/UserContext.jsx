import React, { createContext, useEffect } from 'react';

const UserContext = createContext();


const UserContextProvider = ({ children }) => {

    const [user, setUser] = React.useState({
        loggedIn: false,
        _id: null,
        name: "Guest",
        profilePicture: null
    })

    return (
        <UserContext.Provider value={{
            user: {
                value: user,
                set: setUser
            },
            DEFAULT_PFP_URL: "https://i.ibb.co/g4Gr8wv/default-pfp.png"
        }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContextProvider, UserContext }