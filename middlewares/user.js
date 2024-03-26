const User = require('../models/User')
const { check, validationResult } = require('express-validator');
const { formatMessage, ERROR, STATUS } = require('../errors/errorTypes.js')

exports.userRegisterValidator = async (req, res, next) => {
    // username is not null
    await check("username", "Username is required").notEmpty().run(req);

    //email is not null, valid and normalized
    await check("email", "Email is required").notEmpty().run(req);
    await check("email", "Invalid email").isEmail().run(req);

    await check("password", "Password is required").notEmpty().run(req);
    await check("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain more than 6 characters").run(req);
    await check("password", "Password must have at least 1 uppercase letter, 1 lowercase letter and 1 number")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
        "i"
    ).run(req);

    const result = validationResult(req);

    if (!(result.isEmpty())) {
        return res.status(400).json(formatMessage(
            STATUS.error, 
            null, 
            ERROR.invalidForm, 
            result.array()
        ))
    }

    next()
} 

exports.userById = async (req, res, next) => {
    let user = await User.findById(req._id).exec();
    
    if (!user) {
        return res.status(400).json(
            formatMessage(
                STATUS.error,
                null,
                ERROR.targetNotFound,
                null
            )
        )
    }

    //add user object in req with all user infos
    req.user = user
    next()
}