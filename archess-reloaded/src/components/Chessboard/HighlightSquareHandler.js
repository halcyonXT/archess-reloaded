import { gsap } from "gsap/gsap-core";

let currentHighlighted = null;
let currentFrom = null;

const TRANSITION_DURATION = 0.1;
const SHADOW = {
    on: "inset 0 0 1rem rgba(0, 0, 0, 0.5)",
    off: "inset 0 0 0rem rgba(0, 0, 0, 0.5)"
}

/**
 * Highlights available squares. Provide a falsy value to deselect squares
 * 
 * @param {String[]} available - Available squares to highlight. onClick is attached to these squares
 * @param {Boolean} forceCleanHighlighted - When providing a falsy value or empty array, provide true for `forceCleanHighlighted` to remove all highlighted squares
 * @returns 
 */
export const highlightSquares = ({from, available}, forceCleanHighlighted = false) => {
    //if (currentHighlighted === available) return;

    if (!available || available.length === 0) {
        if (currentHighlighted || forceCleanHighlighted) {
            cleanCurrentHighlighted()
        }
        currentFrom = null;
        currentHighlighted = null;
    }

    if (currentHighlighted) {
        cleanCurrentHighlighted(true)
    }

    function cleanCurrentHighlighted(avoidRehighlight = false) {
        let selected = document.querySelector(`.${currentFrom}`);
        selected?.classList.remove("selected");
        try {
            for (let sq of currentHighlighted) {
                if (avoidRehighlight) {
                    if (available?.includes(sq)) {
                        continue;
                    }
                }
                let el = document.querySelector(`.${sq}`);
                gsap.fromTo(
                    el,
                    {
                        // ! From
                        boxShadow: SHADOW.on
                    },
                    {
                        // ! To
                        boxShadow: SHADOW.off,
                        duration: TRANSITION_DURATION,
                        ease: 'power1.inOut',
                    }
                );
            }
        } catch (ex) {
            console.warn("HighlightSquareHandler: Failed to run cleanCurrentHighlighted: " + ex)
        }
    }

    let avoidRhl = [];
    if (currentHighlighted) avoidRhl = [...currentHighlighted];
    currentHighlighted = available;
    currentFrom = from;

    let selected = document.querySelector(`.${from}`);
    selected?.classList.add("selected");
    for (let sq of available) {
        if (avoidRhl.includes(sq)) {
            continue;
        }
        let el = document.querySelector(`.${sq}`);
        gsap.fromTo(
            el,
            {
                // ! From
                boxShadow: SHADOW.off
            },
            {
                // ! To
                boxShadow: SHADOW.on,
                duration: TRANSITION_DURATION,
                ease: 'power1.inOut',
            }
        );
    }
}