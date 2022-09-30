const express = require("express");
const router=express.Router();

const {  requireSignin,isAuth } = require("../controller/auth.js");
const { userById } = require("../controller/user.js");
const { generateToken} = require("../controller/braintree.js");


router.get('/braintree/getToken/:userID',requireSignin,isAuth,generateToken)


router.param("userID",userById)
module.exports= router
