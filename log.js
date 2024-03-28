exports.log = (type, rmsg) => {
    if (!rmsg) return;
    let msg = String(rmsg);

    if (typeof msg !== 'string') {
        log("err", "Unable to log: " + typeof msg);
    }
    switch (type) {
        case "suc":
        case "success":
            console.log(msg.green.bold);
            break
        case "err":
        case "error":
            console.log(msg.red.bold);
            break
        default:
            console.log(msg.blue.bold);
            break
    }
}