const express = require("express")
const router = express.Router()

// import controllers
const { register, login, logout, getLoggedInUser } = require('../controllers/user')


// middlewares
const {
    userRegisterValidator, 
    userById, 
    safeUserById
} = require("../middlewares/user")

const {verifyToken, verifyTokenAbsence} = require("../middlewares/auth")

// api routes
router.post("/register", verifyTokenAbsence, userRegisterValidator, register, login);
router.post("/login", login);
router.get("/logout", logout);
router.get('/user', verifyToken, userById, getLoggedInUser);
router.get('/user/:userId', safeUserById);

module.exports = router;