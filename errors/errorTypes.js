exports.formatMessage = (status, data, error = null, errorData = null) => {
    if (status === this.STATUS.error) {
        let message = ({
            status,
            error: error ? error : this.ERROR.unspecified,
        });
        if (errorData) {
            message.errorData = errorData;
        }
        return message;
    } else {
        return ({
            status,
            data
        })
    }
}

exports.STATUS = {
    success: 'success',
    error: 'error'
}

exports.ERROR = {
    unspecified: 'unspecified',
    loggedIn: 'logged-in',
    invalidForm: 'invalid-form',
    targetNotFound: 'target-not-found',
    unauthorized: 'unauthorized',
    invalidCredentials: 'invalid-credentials',
    emailTaken: 'email-taken',
    usernameTaken: 'username-taken'
}