import React from 'react'
import { ICONS } from '../Icons'

export default function Svg(props) {
    const [styles, setStyles] = React.useState((() => {
        let outp = {};
        if (!props.xs) return {};
        for (let key of Object.keys(props.xs)) {
            outp[key] = props.xs[key]
        }
        return outp
    })())

    return (
        <div className='-svg' style={styles}>
            {
                ICONS[props.icon]
            }
        </div>
    )
}
