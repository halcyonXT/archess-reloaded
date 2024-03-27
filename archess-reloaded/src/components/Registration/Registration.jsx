import React from 'react'
import './Registration.css'
import { UserContext } from '../../context/UserContext'
import { gsap } from 'gsap/gsap-core'
import validator from 'validator';

const registrationAnimation = (animName, arg) => {
    switch (animName) {
        case "switchTo":
            let target = document.querySelector('.-registration-slider-over');
            let ghostUsername = document.querySelector('#ghost-username-input');
            let username = document.querySelector('#username-input');

            if (arg === 'log-in') {
                
                target.style.transformOrigin = 'center left';

                ghostUsername.style.display = 'block';

                username.style.position = 'absolute';
                username.style.top = '0';

                const TOTAL_ANIM = SLIDER_ANIMATION.SCALE + SLIDER_ANIMATION.MOVE;

                gsap.to(
                    username,
                    {
                        transform: 'translate(-100%)', opacity: 0, duration: TOTAL_ANIM, ease: "back.out(1.7)",
                        onComplete: () => {
                            ghostUsername.style.display = 'none';
                        }
                    }
                )

                gsap.to(
                    ghostUsername,
                    {
                        marginTop: 'calc(-4.4rem)', duration: TOTAL_ANIM,
                        onComplete: () => {
                            ghostUsername.style.marginTop = '0px';
                        }
                    }
                )

                

                gsap.to(
                    target,
                    {transformOrigin: 'center left', transform: 'scaleX(2) translateX(0%)', duration: SLIDER_ANIMATION.SCALE}
                )
                gsap.to(
                    target,
                    {transformOrigin: 'center left', transform: 'scaleX(1) translateX(100%)', duration: SLIDER_ANIMATION.MOVE, delay: SLIDER_ANIMATION.SCALE}
                )
            }

            if (arg === 'sign-up') {
                target.style.transformOrigin = '200% 50%';

                ghostUsername.style.display = 'none';

                username.style.position = 'static';

                const TOTAL_ANIM = SLIDER_ANIMATION.SCALE + SLIDER_ANIMATION.MOVE;

                gsap.to(
                    username,
                    {
                        transform: 'translate(0%)', opacity: 1, duration: TOTAL_ANIM, ease: "back.out(1.7)"
                    }
                )

                gsap.to(
                    target,
                    {transformOrigin: '200% 50%', transform: 'scaleX(2) translateX(100%)', duration: SLIDER_ANIMATION.SCALE}
                )
                gsap.to(
                    target,
                    {transformOrigin: '200% 50%', transform: 'scaleX(1) translate(0)', duration: SLIDER_ANIMATION.MOVE, delay: SLIDER_ANIMATION.SCALE}
                )
            }
            break
    }
}


const SLIDER_ANIMATION = {
    SCALE: .125,
    MOVE: .25
}

let errorMessageTimer = null;
export default function Registration(props) {
    const {user, __forceRegistrationPanel, actions} = React.useContext(UserContext);

    const [panel, setPanel] = React.useState(__forceRegistrationPanel.value);
    const [error, setError] = React.useState("");
    const sliderAnimationRef = React.useRef(null);

    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        password: ""
    })

    const goingBackRef = React.useRef(null);

    
    const switchPanel = (panelName) => {
        if (panelName === panel) return;
        if (sliderAnimationRef.current) return;

        registrationAnimation("switchTo", panelName);

        sliderAnimationRef.current = setTimeout(() => {
            setPanel(panelName);
            sliderAnimationRef.current = null;
        }, (SLIDER_ANIMATION.SCALE + SLIDER_ANIMATION.MOVE) * 1000)
        
    }

    const goBack = () => {
        if (goingBackRef.current) return;

        goingBackRef.current = document.querySelector('.-registration-wrapper').animate(
            [
                {transform: 'scale(1)', opacity: 1},
                {transform: 'scale(0.95)', opacity: 0}
            ], {
                duration: 400,
                delay: 0,
                fill: 'forwards',
                easing: 'ease-out'
            }
        )

        setTimeout(() => {
            document.querySelector('.-registration-wrapper').style.display = 'none';
            props.switchMainPanel(null);
        }, 410)

    }

    React.useEffect(() => {
        if (__forceRegistrationPanel.value === 'log-in') {
            registrationAnimation("switchTo", "log-in");
        }
    }, [])

    const updateFormData = (event, field) => {
        setFormData(p => {
            let outp = {...p};
            outp[field] = event.target.value;
            return outp;
        })
    }

    const finishRegistration = async () => {
        const passwordMatch = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,40}$/;

        if ((validator.isEmpty(formData.username) && panel === "sign-up") || validator.isEmpty(formData.email) || validator.isEmpty("password")) {
            return showError("Please fill all the neccessary fields");
        }

        if (!validator.isAscii(formData.username) && (panel === "sign-up")) {
            return showError("Please enter a valid username")
        }

        if (!validator.isLength(formData.username, {min: 2, max: 30}) && (panel === "sign-up")) {
            return showError("Username must be between 2 and 30 characters");
        }

        if (!validator.isEmail(formData.email)) {
            return showError("Please enter a valid email")
        }

        if (!passwordMatch.test(formData.password)) {
            return showError("Password requirements: At least 6 characters, at least one number, one uppercase and one lowercase letter");
        }

        if (panel === 'sign-up') {
            let res = await actions.register({
                ...formData
            });

            if (res.status === 'error') {
                return showError(res.message);
            }
        }
        if (panel === 'log-in') {
            let res = await actions.login({
                email: formData.email,
                password: formData.password
            })

            if (res.status === 'error') {
                return showError(res.message);
            }
        }

        goBack();
    }

    /*React.useEffect(() => {
        if (user.value._requestMade.done) {
            if (user.value._requestMade.message) {
                
            }
        }
    }, [user.value._requestMade])*/

    const showError = (message) => {
        clearTimeout(errorMessageTimer);

        setError(message);

        errorMessageTimer = setTimeout(() => {
            setError("");
        }, 10000)
    }

    return (
        <div className='-registration-wrapper'>
            <div className="-registration-navbar">
                <h1 className='-registration-logo'>ARCHESS</h1>
                <div className="-registration-back-button" onClick={goBack}>
                    BACK
                </div>
            </div>
            <div className="-registration-slider-wrapper">
                <div className="flex">
                    <h4 className={`-registration-header ${panel !== 'sign-up' ? "inactive" : ""}`} onClick={() => switchPanel("sign-up")}>SIGN UP</h4>
                    <h4 className={`-registration-header ${panel !== 'log-in' ? "inactive" : ""}`} onClick={() => switchPanel("log-in")}>LOG IN</h4>
                </div>
                <div className="-registration-slider-under"></div>
                <div className="-registration-slider-over"></div>
            </div>
            <div className='-inputs-wrapper'>
                <input disabled id='ghost-username-input' type="text" className="-registration-input -ghost-input" placeholder='' />
                <input onChange={(e) => updateFormData(e, "username")} value={formData.username} id='username-input' type="text" className="-registration-input" placeholder='Username' />
                <input onChange={(e) => updateFormData(e, "email")} value={formData.email} id='email-input' type="text" className="-registration-input" placeholder='Email' />
                <input onChange={(e) => updateFormData(e, "password")} value={formData.password} id='password-input' type="password" className="-registration-input" placeholder='Password' />
                {
                    user.value._requestMade.done
                    ?
                    <button className='-registration-finish' onClick={finishRegistration}>
                        DONE
                    </button>
                    :
                    <div className='flex' style={{justifyContent: 'center'}}>
                        <div className="loader" style={{height: '2.25rem'}}></div>
                    </div>
                }
                {
                    error
                    &&
                    <div className='-error' style={{marginTop: '1.5rem'}}>
                        <div className="-pre">
                            <svg xmlns="http://www.w3.org/2000/svg" style={{height: '2rem', aspectRatio: '1 / 1', fill: '#FF6961'}} viewBox="0 -960 960 960"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>
                        </div>
                        <div className='-over'></div>
                        <div className="-text">
                            {error}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
