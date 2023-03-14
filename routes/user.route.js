// create userApp mini express application
const express = require("express");

const userApp = express.Router();

// import controllers from usercontroller
const { registerUser, loginUser,resetPassword, forgetPassword } = require("../controllers/user.controller");

// register user
userApp.post("/user", registerUser);

// login user
userApp.post("/user/login", loginUser);

//forget password
userApp.post("/forget-password",forgetPassword)
//reset password
userApp.post("/reset-password/email/:email",resetPassword)

 

// export userApp
module.exports = userApp;
