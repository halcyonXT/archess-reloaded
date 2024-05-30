const { Chess } = require('chess.js');

const isMoveLegal = (fen, move) => {
    try {
        const ch = new Chess(fen);
        let m = ch.move(move);
        return true;
    } catch (ex) {
        return false;
    }
    //console.log(m)
}

const isGameOver = (fen) => {
    const ch = new Chess(fen);
    return ch.isGameOver();
}

/**
 * Returns {
 *      color: "black", "white" or "none",
 *      type: "checkmate", "stalemate", "draw" (draw by threefold, 50 move rule or agreement)
 *      description: e.g. "Insufficient material"
 * } (as strings)
 */
const whoWon = (fen) => {
    const isOver = isGameOver(fen);

    let output = {
        color: null,
        type: null,
        description: null
    }

    const ch = new Chess(fen);

    if (isOver) {
        let turn = ch.turn() === "b" ? "black" : "white";

        if (ch.isCheckmate()) {
            return {
                color: turn,
                type: "checkmate"
            }
        }

        if (ch.isDraw()) {
            if (ch.isInsufficientMaterial()) {
                return {
                    color: "none",
                    type: "draw",
                    description: "Insufficient material"
                }
            }

            if (ch.isThreefoldRepetition()) {
                return {
                    color: "none",
                    type: "draw",
                    description: "Threefold repetition"
                }
            }

            if (ch.isStalemate()) {
                return {
                    color: turn,
                    type: "draw",
                    description: "Stalemate"
                }
            }
        }
    }

    return output;
}

module.exports = {
    isMoveLegal
}