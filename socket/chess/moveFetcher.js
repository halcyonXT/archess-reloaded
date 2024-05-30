const {buildSocketMessage} = require('../buildSocketMessage.js');
// ! USED FOR PACKET MESSAGE WITH "L" PREFIX PARSING
const jsChessEngine = require('js-chess-engine')
const { aiMove } = jsChessEngine


exports.moveFetcher = async (fen, rawDepth) => {
    let depth = rawDepth;

    // ! replace continuation from stockfish packet with js-chess-engine one. will provide all info from api except its bestmove
    let replaceCont = null;

    const getLPrefixMove = async (depth) => {
        let nd = String(depth).charAt(0) === "L" ? String(depth).slice(-1) : depth;
        let returner = null;
        try {
            returner = aiMove(fen, nd);
        } catch (ex) {console.log("Lpref warn")}

        return returner;
    }


    if ((String(depth)).charAt(0) === "L") {
        let raw = await getLPrefixMove(depth);

        if (typeof raw !== 'object' || !raw) {
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
    const maxDepthParams = {
        fen,
        depth: "15"
    }
    

    const queryString = new URLSearchParams(params).toString();
    const maxDepthQuery = new URLSearchParams(maxDepthParams).toString();
    const url = `${apiUrl}?${queryString}`;
    const mdurl = `${apiUrl}?${maxDepthQuery}`;

    let raw = await fetch(url);

    const maxDepthReplaceKeys = ["mate", "bestmove", "evaluation"];

    if (!raw.ok) {
        return buildSocketMessage(
            "Failure, retrying in 3s",
            "error",
            ({})
        )
    }

    let processed = await raw.json();

    let rawMD = await fetch(mdurl);

    if (!rawMD.ok) {
        return buildSocketMessage(
            "Failure, retrying in 3s",
            "error",
            ({})
        )
    }

    try {
        let mdprocess = await rawMD.json();
    
        for (let key of maxDepthReplaceKeys) {
            processed[key] = mdprocess[key];
        }
    
        processed.maxDepthContinuation = mdprocess.continuation;
    } catch (ex) {
        console.log("mdproc failure")
    }

    if (replaceCont) {
        processed.continuation = replaceCont;
    }
    
    //console.log(JSON.stringify(processed))

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