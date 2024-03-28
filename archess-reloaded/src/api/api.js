let URL = "http://localhost:8080";
//s
const invalidParameterError = ({
    status: 'error',
    error: 'invalid-params'
});

const networkError = ({
    status: 'error',
    error: 'network-error'
})

export const getUserInfo = async() => {
    try {
        let res = await fetch(`${URL}/user`, {
            method: 'GET',
            'credentials': 'include'
        });
    
        if (!res) {
            return networkError;
        }
    
        let proc = await res.json();
    
        return proc;
    } catch (ex) {return networkError}
}

export const register = async (userData) => {
    if (!userData || (typeof userData !== 'object')) return invalidParameterError;
    try {
        if (!userData["username"] || !userData["email"] || !userData["password"]) return invalidParameterError;
    } catch (ex) {return invalidParameterError}

    let raw = await fetch(`${URL}/register`, {
        method: 'POST',
        'credentials': 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    if (!raw) {
        return networkError;
    }

    let proc = await raw.json();
    return proc;
}

export const login = async (userData) => {
    if (!userData || (typeof userData !== 'object')) return invalidParameterError;
    try {
        if (!userData["email"] || !userData["password"]) return invalidParameterError;
    } catch (ex) {return invalidParameterError}

    let raw = await fetch(`${URL}/login`, {
        method: 'POST',
        'credentials': 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    });

    if (!raw) {
        return networkError;
    }

    let proc = await raw.json();
    return proc;
}