const {buildSocketMessage} = require('../buildSocketMessage.js');

exports.moveFetcher = async (fen, rawDepth) => {
    let depth = rawDepth;

    // ! replace continuation from stockfish packet with js-chess-engine one. will provide all info from api except its bestmove
    let replaceCont = null;

    const getLPrefixMove = async (depth) => {
        let nd = String(depth).charAt(0) === "L" ? String(depth).slice(-1) : depth;
        return aiMove(fen, nd);
    }

    if ((String(depth)).charAt(0) === "L") {
        let raw = await getLPrefixMove(depth);

        if (typeof raw !== 'object') {
            return buildSocketMessage(
                "js-chess-engine error",
                "error",
                ({})
            )
        }

        let key = Object.keys(raw)[0];
        replaceCont = `${key}${raw[key]}`.toLowerCase();
        depth = (String(depth)).slice(-1);
    }

    const apiUrl = 'https://stockfish.online/api/s/v2.php';
    const params = {
        fen,
        depth
    };
    

    const queryString = new URLSearchParams(params).toString();
    const url = `${apiUrl}?${queryString}`;

    let raw = await fetch(url);

    if (!raw.ok) {
        return buildSocketMessage(
            "Failure, retrying in 3s",
            "error",
            ({})
        )
    }

    let processed = await raw.json();

    if (replaceCont) {
        processed.continuation = replaceCont;
    }

    //log("success", processed.continuation)

    if (!(processed?.success)) {
        return buildSocketMessage(
            "API failure",
            "error",
            ({})
        )
    }

    return buildSocketMessage(
        "",
        "success",
        processed
    )
        
}