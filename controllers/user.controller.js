// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();
const nodemailer = require('nodemailer');
//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD // app password
  }
})
//Creating otps object
let otps={}

// import bcryptjs
const bcryptjs = require("bcryptjs");

// import jwt
const jwt = require("jsonwebtoken");

// import Employee Model
const { Employee } = require("../models/employee.model");

// import user model
const { User } = require("../models/user.model");

//register
const registerUser = expressAsyncHandler(async (req, res) => {
  // get the body from request
  let { userId, email, username, password } = req.body;

  // check the user is existed in our company database or not
  let userExisted = await Employee.findOne({
    where: {
      empId: userId,
    },
  });

  // if the user is not existed in our company then restrict the resgitration process
  if (userExisted == undefined) {
    res.send({message: "Unauthorized access" });
  }

  // if the user existed 
  else {
    // check if the employee already exists with that email
    let users = await User.findOne({
      where: {
        email: email,
      },
    });

    // if user found already
    if (users != undefined) {
      res.send({ message: "User already found with that email" });
    }

    // if user not exists 
    else {
      // hash the password
      let hashedPassword = await bcryptjs.hash(password, 6);
      req.body.password = hashedPassword;
      await User.create(req.body);
      res.status(201).send({ message: "User Registered successfully" });
    }
  }
});

// user Login
const loginUser = expressAsyncHandler(async (req, res) => {
  // get the userId and password from body
  let { userId, password } = req.body;
  // check the user existence using userId
  let userRecord = await User.findOne({ where: { userId: userId}});
  // if user not found
  if (userRecord == undefined) {
    res.status(404).send({ message: `User not found with ${userId}` });
  }
  // if user found check password
  else {
    let checkPassword = await bcryptjs.compare(password,userRecord.dataValues.password);
    // if password not matched
    if (!checkPassword) {
      res.status(200).send({ message: "Incorrect password" });
    } else {
      // create a jwt token
      let signedToken = jwt.sign(
        {
          userId: userRecord.dataValues.userId,
          userRole: userRecord.dataValues.role,
        },
        process.env.SECRET_KEY,
        {
          //token expires
          expiresIn: "1d",
        }
      );
      //send res
      res.status(200).send({ message: "success", payload: signedToken,userRecord,user:userRecord});
    }
  }
});
//forgot password
const forgetPassword=expressAsyncHandler(async(req,res)=>{
  //generating 6 digit random number as otp to reset password
  let otp=Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  //add OTP to otps object
  otps[req.body.email]=otp
  //draft email
  let mailOptions = {
    //from which mail
      from: process.env.EMAIL,
      //the mail which we have given in req http
      to: req.body.email,
      //subject
      subject: 'OTP to reset password',
      //text which need to be send to mail
      text: `Hello ,
       We received a request to reset your password .Enter the following OTP to reset your password :
        `+otp
        
    }
     console.log(otp)
    
  //send email
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  //setting valid time to OTP(10 minutes)
  setTimeout(()=>{
      //delete OTP from object after 10 minutes
      delete otps[req.body.email]
  },70000000)
  //send res
  res.status(200).send({message:"OTP to reset your password is sent to your email"})
})
//reset password
const resetPassword=expressAsyncHandler(async(req,res)=>{
  //otp matches
  if(req.body.otp==otps[req.params.email]){
      console.log("password verififed");

      let hashedPassword = await bcryptjs.hash(req.body.password, 6);
      
      //update the password
      await User.update({password:hashedPassword},{where:{
          email:req.params.email
      }})
      //send res
      res.status(200).send({message:"Password reset sucessfully"})
  }
  else{
    //send res
      res.status(200).send({message:"Invalid OTP"})
  }
})
// export controllers
module.exports = { registerUser, loginUser,forgetPassword,resetPassword };
