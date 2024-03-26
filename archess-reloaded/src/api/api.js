let URL = "http://localhost:8080";


export const getUserInfo = async() => {
    let res = await fetch(`${URL}/user`);

    if (!res ) {
        return {
            status: "error",
            error: "network-error"
        }
    }

    let proc = await res.json();

    return proc;
}