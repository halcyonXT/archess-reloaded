const { formatMessage, STATUS, ERROR } = require('../errors/errorTypes')
const User = require('../models/User')
const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.register = async (req, res, next) => {
    const usernameExists = await User.findOne({
        username: req.body.username
    })
    const emailExists = await User.findOne({
        email: req.body.email
    })

    if (usernameExists) {
        return res.status(401).json(formatMessage(
            STATUS.error,
            null,
            ERROR.usernameTaken,
            {causedBy: ['username']}
        ))
    }

    if (emailExists) {
        return res.status(401).json(formatMessage(
            STATUS.error,
            null,
            ERROR.emailTaken,
            {causedBy: ['email']}
        ))
    }

    const pusher = req.body

    const user = new User(pusher)
    await user.save()

    /*res.status(201).json(
        formatMessage(
            STATUS.success,
            'Signup successful'
        )
    )*/
    next();
}

exports.login = async (req, res) => {
    // find the user based on the email
    const { email, password } = req.body;

    let err = null;
    let user = await User.findOne({email}).exec();

    if (err || !user) {
        return res.status(401).json(formatMessage(
            STATUS.error,
            null,
            ERROR.targetNotFound,
            {causedBy: ['email', 'password']}
        ))
    }

    //if user is found, we use the authenticate methods
    if (!user.authenticate(password)) {
        return res.status(401).json(formatMessage(
            STATUS.error,
            null,
            ERROR.invalidCredentials,
            {causedBy: ['email', 'password']}
        ))
    }//if pass is incorrect

    //generate a token with user id and jwt secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "48h"
    })

    //persist the token as jwt in cookie with empty expiry date
    res.cookie("jwt", token, {expire: new Date() + 9999, httpOnly: false, secure: true});


    //return the response with user
    const { username } = user;
    return res.json(
        formatMessage(
            STATUS.success,
            {
                _id: user._id,
                username,
                email: user["email"],
                description: user["description"]
            }
        )
    )
}

exports.confirmPassword = async (req, res) => {
    const { email, password } = req.body;

    await User.findOne({email}).exec((err, user) => {
        if (err) {
            return res.status(500).json({
                confirmed: false
            })
        }

        if (!user) {
            return res.status(404).json({
                confirmed: false
            })
        }

        //if user is found, we use the authenticate methods
        if (!user.authenticate(password)) {
            return res.status(200).json({
                confirmed: false
            })
        }//if pass is incorrect

        return res.json({
            confirmed: true
        })
    })
}

exports.logout = (req, res) => {
    res.clearCookie("jwt")

    return res.json(
        formatMessage(
            STATUS.success,
            "Logout successful"
        )
    )
}

exports.getLoggedInUser = (req, res) => {
    let fields = req.user._doc;

    let data = {};

    data._id = fields._id;
    data.username = fields.username;
    data.profilePicture = fields.profilePicture;
    data.description = fields.description;
    data.botsBeaten = fields.botsBeaten;

    return res.status(200).json(
        formatMessage(
            STATUS.success,
            data
        )
    )
}
