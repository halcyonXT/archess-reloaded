import React from 'react'
import './Registration.css'
import { UserContext } from '../../context/UserContext'
import { gsap } from 'gsap/gsap-core'

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


export default function Registration(props) {
    const {__forceRegistrationPanel} = React.useContext(UserContext);

    const [panel, setPanel] = React.useState(__forceRegistrationPanel.value);
    const sliderAnimationRef = React.useRef(null);

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
                <input id='ghost-username-input' type="text" className="-registration-input -ghost-input" placeholder='' />
                <input id='username-input' type="text" className="-registration-input" placeholder='Username' />
                <input id='email-input' type="text" className="-registration-input" placeholder='Email' />
                <input id='password-input' type="password" className="-registration-input" placeholder='Password' />
            </div>
        </div>
    )
}
