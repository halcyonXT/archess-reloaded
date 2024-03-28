import React from 'react'
import { ICONS } from '../Icons'

export default function Svg(props) {
    const [styles, setStyles] = React.useState((() => {
        let outp = {};
        if (!props.xs) return {};
        /*for (let key of Object.keys(props.xs)) {
            outp[key] = props.xs[key]
        }*/
        outp = {...props.xs};
        return outp
    })())

    if (props.xClick) {
        return (
            <div className={`-svg ${props.xc ? props.xc : ""}`} style={styles} onClick={props.xClick}>
                {
                    ICONS[props.icon]
                }
            </div>
        )
    }

    return (
        <div className={`-svg ${props.xc ? props.xc : ""}`} style={styles}>
            {
                ICONS[props.icon]
            }
        </div>
    )
}
