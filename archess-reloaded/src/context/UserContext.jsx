import React, { createContext, useEffect } from 'react';
import { getUserInfo, register, login } from '../api/api';
import { buildApiErrorHandler } from '../api/buildApiErrorHandler';
import { SERVER_ERROR, API_FILE_ERROR } from '../api/errorTypes';
import { SocketContext } from './SocketContext';

const UserContext = createContext();

const DEFAULT_USER = ({
    _requestMade: {
        done: true,
        proceed: true,
        message: ""
    },
    _id: null,
    loggedIn: false,
    username: "Guest",
    profilePicture: null,
    botsBeaten: {
        be: 3,
        ea: 3,
        me: 3,
        ha: 3,
        ad: 3,
        ex: 3
    }
})

const UserSchema = ({
    _id: "any",
    username: "string",
    profilePicture: "string",
    email: "string",
    description: "string",
    botsBeaten: "object"
})




const UserContextProvider = ({ children }) => {
    const [FRP, setFRP] = React.useState("sign-up");
    const {socket} = React.useContext(SocketContext);

    /*const [user, setUser] = React.useState({
        _requestMade: {
            done: false,
            proceed: false,
            message: ""
        },
        loggedIn: false,
        _id: null,
        username: "Guest",
        profilePicture: null
    })*/
    const [user, setUser] = React.useState({...DEFAULT_USER})

    const userIDRef = React.useRef(null);

    console.log(user)
    const applyDataToUserFields = (data, getApplyFields = false) => {
        if (typeof data !== "object") return console.warn("applyDataToUserFields recieved non-object: " + typeof data);

        let applyFields = {};

        for (let key of Object.keys(data)) {
            if (UserSchema.hasOwnProperty(key)) {
                if (!(UserSchema[key] === "any")) {
                    /*
                    if (!(data[key] instanceof UserSchema[key])) {
                        console.warn(`${key} not instance of ${UserSchema[key]}`);
                        continue;
                    }
                    */
                    if (typeof data[key] !== UserSchema[key]) {
                        console.warn(`${key} not of type "${UserSchema[key]}": ` + typeof data[key]);
                        continue;
                    }
                }
                applyFields[key] = data[key];
            }
        }

        if (getApplyFields) return applyFields;

        setUser(p => ({
            ...p,
            ...applyFields
        }))
    }

    const setRequestMadeField = (done, proceed, message) => setUser(p => ({...p, _requestMade: {done, proceed, message}}))

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
        return new Promise(async (resolve, reject) => {
            let res = await getUserInfo();
            let {proceed, message} = userFetchDecoder(res);
    
            setRequestMadeField(false, false, "");
    
            if (proceed) {
                if (res?.status === "error") {
                    setUser({...DEFAULT_USER});
                } else {
                    // TODO - Gotten correct user info
                    setUser({
                        _requestMade: {
                            done: true,
                            proceed: true,
                            message: ""
                        },
                        loggedIn: true,
                        ...applyDataToUserFields(res.data, true)
                    })
                    //console.log(res.data)
                }
                resolve(true);
            } else {
                setRequestMadeField(true, proceed, message);
                resolve(true);
            }
        })
    }

    const actions = {

        registrationInProgress: false,
        loginInProgress: false,

        login: async function(data){
            if (this.loginInProgress) return;
            this.loginInProgress = true;
            setRequestMadeField(false, false, "");

            const SUCCESS_MESSAGE = ({
                status: "success",
                data: ""
            })

            const ERROR_MESSAGE = (msg) => ({
                status: 'error',
                message: msg
            })

            let {lookup, getErrorMessage} = buildApiErrorHandler([
                [SERVER_ERROR.invalidCredentials, true, "Invalid credentials. Please try again"],
                [SERVER_ERROR.targetNotFound, true, "No user found"],
                [SERVER_ERROR.loggedIn, true, "User is already logged in"],
                [API_FILE_ERROR.networkError, true, <>A network error occurred<br/><u onClick={() => this.register(data)}>Click here to retry</u></>],
                [API_FILE_ERROR.invalidParams, true, "AFE: Invalid parameters"]
            ]);

            const userData = await login(data);

            this.loginInProgress = false;

            if (!userData) {
                let obj = getErrorMessage(API_FILE_ERROR.networkError);
                setRequestMadeField(true, true, obj.message);
                return ERROR_MESSAGE(obj.message);
            }

            if (userData.status === "error") {
                let obj = getErrorMessage(userData.error);
                setRequestMadeField(true, true, obj.message);
                return ERROR_MESSAGE(obj.message);
            }

            let applyFields = applyDataToUserFields(userData.data, true);

            setUser({
                _requestMade: {
                    done: true,
                    proceed: true,
                    message: ""
                },
                loggedIn: true,
                ...applyFields
            })

            return SUCCESS_MESSAGE;
        },

        // * aka signup
        register: async function(data) {
            if (this.registrationInProgress) return;

            this.registrationInProgress = true;

            setRequestMadeField(false, false, "");
            // ! No proceeds, don't check for proceed
            let {lookup, getErrorMessage} = buildApiErrorHandler([
                [SERVER_ERROR.emailTaken, false, "Email is already in use. Please choose another"],
                [SERVER_ERROR.usernameTaken, false, "Username is already in use. Please choose another"],
                [SERVER_ERROR.invalidForm, false, "Invalid parameters. Please double-check your information"],
                [SERVER_ERROR.loggedIn, false, "User is already logged in"],
                [API_FILE_ERROR.networkError, false, <>A network error occurred<br/><u onClick={() => this.register(data)}>Click here to retry</u></>],
                [API_FILE_ERROR.invalidParams, false, "AFE: Invalid parameters"]
            ]);

            const SUCCESS_MESSAGE = ({
                status: "success",
                data: ""
            })

            const ERROR_MESSAGE = (msg) => ({
                status: 'error',
                message: msg
            })

            const userData = await register(data);

            //setTimeout(() => {
                this.registrationInProgress = false;
    
                if (!userData) {
                    let obj = getErrorMessage(API_FILE_ERROR.networkError);
                    setRequestMadeField(true, true, obj.message);
                    return ERROR_MESSAGE(obj.message);
                }
    
                if (userData.status === "error") {
                    let obj = getErrorMessage(userData.error);
                    setRequestMadeField(true, true, obj.message);
                    return ERROR_MESSAGE(obj.message);
                }

                let applyFields = applyDataToUserFields(userData.data, true);

                //console.log(userData)
                //console.log(applyFields)
    
                setUser({
                    _requestMade: {
                        done: true,
                        proceed: true,
                        message: ""
                    },
                    loggedIn: true,
                    ...applyFields
                })

                return SUCCESS_MESSAGE;
            //}, 5000)
        }
    }


    React.useEffect(() => {
        const UIF = async () => {
            await userInfoFetch();

            socket.emit("client-init", ({
                url: document.location.pathname,
                _id: user._id
            }))
        }

        UIF();
    }, []);

    React.useEffect(() => {
        if (user._id !== userIDRef.current) {
            userIDRef.current = user._id;

            socket.emit("update-user", ({
                _id: user._id
            }))
        }
    }, [user])

    // console.log(user)
    // console.log(userIDRef)


    return (
        <UserContext.Provider value={{
            user: {
                value: user,
                set: setUser
            },
            actions: actions,
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