import React from 'react'
import "./SpecsSelection.css"
import { GameContext } from '../../context/GameContext'

const STAR_DESC = {
    1: "Unlimited drawbacks, evaluation bar.",
    2: "3 drawbacks, evaluation bar.",
    3: "No drawbacks, no evaluation bar."
}

export default function SpecsSelection(props) {
    const {game} = React.useContext(GameContext);
    const [currChecked, setCurrChecked] = React.useState(null);
    const [selectedTime, setSelectedTime] = React.useState("10min");

    const setSpec = (spec, value) => {
        //console.log("specset")
        game.set(p => {
            let outp = {...p};
            outp.specs[spec] = value;
            return outp;
        })
    }

    const setTime = (name, time, add) => {
        setSelectedTime(name);
        game.set(p => {
            let outp = {...p};
            outp["timeTotal"] = time;
            outp["timeAddition"] = add;
            return outp;
        })
    }
    
    const check = (key) => setCurrChecked(p => p === key ? null : key);

    return (
        <>
            {/*<div className={`-specs-selection ${props.animate ? "animate" : ""}`} style={props.xs ? props.xs : {}}>*/}
            <div className="-specs-selection-spec">
                <div className="-specs-selection-descriptor">Time control</div>
                <input type='checkbox' className="cbhide cbtrigger" id="lecb2" checked={currChecked === "TC"} onClick={() => check("TC")}></input>
                <label className='-specs-selection-select' for="lecb2">{selectedTime}</label>
                <div className="-specs-selection-select-dropdown">
                    <div className="flex w-full">
                        <div className="-ssitem third" onClick={() => setTime("1min", 60, 0)}>
                            1min
                        </div>
                        <div className="-ssitem third" onClick={() => setTime("1 | 1", 60, 1)}>
                            1 | 1
                        </div>
                        <div className="-ssitem third" onClick={() => setTime("2 | 1", 120, 1)}>
                            2 | 1
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="-ssitem third" onClick={() => setTime("3min", 180, 0)}>
                            3min
                        </div>
                        <div className="-ssitem third" onClick={() => setTime("3 | 2", 180, 2)}>
                            3 | 2
                        </div>
                        <div className="-ssitem third" onClick={() => setTime("5min", 300, 0)}>
                            5min
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="-ssitem third" onClick={() => setTime("10min", 600, 0)}>
                            10min
                        </div>
                        <div className="-ssitem third" onClick={() => setTime("15 | 10", 900, 10)}>
                            15 | 10
                        </div>
                        <div className="-ssitem third" onClick={() => setTime("30min", 1800, 0)}>
                            30min
                        </div>
                    </div>
                    <div className="flex w-full">
                        <div className="-ssitem third" onClick={() => setTime("1h", 3600, 0)}>
                            1h
                        </div>
                        <div className="-ssitem third" onClick={() => setTime("2h", 7200, 0)}>
                            2h
                        </div>
                        <div className="-ssitem third" onClick={() => setTime("Unlimited", Infinity, 0)}>
                            Unlimited
                        </div>
                    </div>
                </div>
            </div>
            <div className="-specs-selection-spec">
                <div className="-specs-selection-descriptor">Difficulty</div>
                <input type='checkbox' className="cbhide cbtrigger" id="lecb" checked={currChecked === "DIFF"} onClick={() => check("DIFF")}></input>
                <label className='-specs-selection-select' for="lecb">{"★".repeat(game.value.specs.stars)}</label>
                <div className="-specs-selection-select-dropdown">
                    <div className="flex w-full">
                        <div className="-ssitem third" onClick={() => setSpec("stars", 1)}>
                            ★
                        </div>
                        <div className="-ssitem third" onClick={() => setSpec("stars", 2)}>
                            ★★
                        </div>
                        <div className="-ssitem third" onClick={() => setSpec("stars", 3)}>
                            ★★★
                        </div>
                    </div>
                </div>
                <div className="-specs-selection-descriptor" style={{fontSize: "0.8rem", fontWeight: "400"}}>{STAR_DESC[game.value.specs.stars]}</div>
            </div>
            <div className="-specs-selection-spec">
                <div className="-specs-selection-descriptor">Start as</div>
                <input type='checkbox' className="cbhide cbtrigger" id="saas" checked={currChecked === "SA"} onClick={() => check("SA")}></input>
                <label className='-specs-selection-select' for="saas">{game.value.specs.startAs.toUpperCase()}</label>
                <div className="-specs-selection-select-dropdown">
                    <div className="flex w-full">
                        <div className="-ssitem third" onClick={() => setSpec("startAs", "black")}>
                            BLACK
                        </div>
                        <div className="-ssitem third" onClick={() => setSpec("startAs", "white")}>
                            WHITE
                        </div>
                        <div className="-ssitem third" onClick={() => setSpec("startAs", "random")}>
                            RANDOM
                        </div>
                    </div>
                </div>
            </div>
            <div className='-main-left-button-style-wrapper' style={{marginBottom: "-1.5rem", marginTop: "1rem"}}>
                <button className="-main-left-button" onClick={props.initiateGame}>
                    START
                </button>
                <div className='-main-left-button-notch' />
            </div>
        </>
    )
}
