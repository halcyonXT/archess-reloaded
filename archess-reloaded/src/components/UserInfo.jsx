import React from 'react'
import { UserContext } from '../context/UserContext'
import Svg from './Svg'
import { gsap } from 'gsap/gsap-core';


export default function UserInfo(props) {
    const {user} = React.useContext(UserContext);

    if (!user.value._requestMade.done) {

        return <div className="loader" style={{height: '2rem'}}></div>

    } else if (!user.value._requestMade.proceed) {
        return <div className='-error'>
            <div className="-pre">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>
            </div>
            <div className='-over'></div>
            <div className="-text">
                {user.value._requestMade.message}
            </div>
        </div>

        
    }

    /*if (!user.loggedIn) {
        return <UserLoggedOut initiateRadialGradientTransition={props.initiateRadialGradientTransition} setMainPanel={props.setMainPanel}/>
    }*/

    return (
        <>
            <UserContainer 
            community={props.community} 
            xs={props.xs} 
            setMainPanel={props.setMainPanel}/>
        </>
    )
}

const DEFAULT_LOGGED_OUT = ({
    username: "Guest",
    description: "A non-registered user"
})

const UserContainer = (props) => {
    const {user, DEFAULT_PFP_URL, __forceRegistrationPanel} = React.useContext(UserContext);

    /**
     * Will trigger radial gradient transition and disposal of LeftPanel
     * @param {String} panelName - Name of panel, also name of route attribute inside the CustomRouter in App 
     */
    const switchMainPanel = (panelName, opts) => {
        if (opts) {
            props.setMainPanel('registration', opts);
        } else {
            props.setMainPanel('registration');
        }
        
        // * Read in UserContext
        __forceRegistrationPanel.set(panelName);
    }

    const switchMainPanelNonRegistration = (panelName, opts) => {
        const generalProcedure = () => {
            if (opts) {
                props.setMainPanel(panelName, opts);
            } else {
                props.setMainPanel(panelName);
            }
        }

        if (props.community) {
            document.querySelector('.-community').animate([
                {opacity: 1, transform: 'scale(1)'},
                {opacity: 0,
                    transform: 'scale(0.95)'}
            ], {
                duration: 400,
                fill: 'forwards'
            })
            setTimeout(() => {
                generalProcedure();
            }, 400)
        } else {
            generalProcedure();
        }

    }

    return (
        <div className="-user-info" style={props.xs ? props.xs : {}}>
            <div className="-user-profile">
                <img
                    src={
                        !user.value.profilePicture
                        ?
                        DEFAULT_PFP_URL
                        :
                        user.value.profilePicture
                    }
                />
                <div className="-user-profile-text-wrapper">
                    <div className="-user-profile-text-username">
                        {user.value.loggedIn ? user.value.username : DEFAULT_LOGGED_OUT.username}
                    </div>
                    <div className="-user-profile-text-description">
                        {user.value.loggedIn ? user.value.description : DEFAULT_LOGGED_OUT.description}
                    </div>
                </div>
            </div>
            {
                <div className="-user-not-logged-button-wrapper">
                    {
                        !user.value.loggedIn
                        ?
                        <>
                            <div className="-user-not-logged-button" onClick={() => switchMainPanel('log-in')}>LOG IN</div>
                            <div className="-user-not-logged-button" onClick={() => switchMainPanel('sign-up')}>SIGN UP</div>
                        </>
                        :
                        <div className="-user-not-logged-button" 
                            style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} 
                            onClick={() => switchMainPanelNonRegistration(props.community ? null : 'community', {to: '-40%'})}>
                            {
                                props.community
                                ?
                                "MAIN MENU"
                                :
                                <>
                                    <Svg icon="chat"/> COMMUNITY
                                </>
                            }
                        </div>
                    }
                </div>
            }
        </div>
    )
}

/*const UserLoggedOut = (props) => {
    

    return (
        <div className="-user-info">
            <div className="-user-profile">
                <img
                    src={
                        !user.value.profilePicture
                        ?
                        DEFAULT_PFP_URL
                        :
                        user.value.profilePicture
                    }
                />
                <div className="-user-profile-text-wrapper">
                    <div className="-user-profile-text-username">
                        Guest
                    </div>
                    <div className="-user-profile-text-description">
                        A non-registered user
                    </div>
                </div>
            </div>
            <div className="-user-not-logged-button-wrapper">
                <div className="-user-not-logged-button" onClick={() => switchMainPanel('log-in')}>LOG IN</div>
                <div className="-user-not-logged-button" onClick={() => switchMainPanel('sign-up')}>SIGN UP</div>
            </div>
        </div>
    )
}*/
