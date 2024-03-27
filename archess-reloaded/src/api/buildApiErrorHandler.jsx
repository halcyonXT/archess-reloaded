/**
 * Handler for API failures
 * @param {Object} table - Object of key value pairs - Key represents the error type, its value represents the response in the Error container. The value should be either a string or JSX
 */
export const buildApiErrorHandler = (table) => {
    const lookup = new Map();

    table.forEach(pair => {
        let [key, proceed, message] = pair;
        lookup.set(key, {message, proceed});
    })

    const getErrorMessage = (key) => {
        let msg = lookup.get(key);

        if (!msg) {
            return BAPH_ERRORS.invalidErrorName(key);
        }

        return msg
    }

    return {
        lookup,
        getErrorMessage
    }
}

const BAPH_ERRORS = {
    invalidErrorName: (k) => 'AEH: Invalid error name provided: ' + k,
}