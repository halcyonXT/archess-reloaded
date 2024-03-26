import React from 'react'
import { UserContext } from '../context/UserContext'


export default function UserInfo(props) {
    const {user} = React.useContext(UserContext);

    if (!user.value._requestMade.done) {

        return <div className="loader" style={{height: '2rem'}}></div>

    } else if (!user.value._requestMade.proceed) {

        return <div className='-error'>
            {user.value._requestMade.message}
        </div>
        
    }

    if (!user.loggedIn) {
        return <UserLoggedOut initiateRadialGradientTransition={props.initiateRadialGradientTransition} setMainPanel={props.setMainPanel}/>
    }

    return (
        <>
        </>
    )
}

const UserLoggedOut = (props) => {
    const {user, DEFAULT_PFP_URL, __forceRegistrationPanel} = React.useContext(UserContext);

    /**
     * Will trigger radial gradient transition and disposal of LeftPanel
     * @param {String} panelName - Name of panel, also name of route attribute inside the CustomRouter in App 
     */
    const switchMainPanel = (panelName) => {
        props.setMainPanel('registration');
        
        // * Read in UserContext
        __forceRegistrationPanel.set(panelName);
    }

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
}
