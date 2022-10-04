const express = require("express");
const router=express.Router();

const {  requireSignin,isAuth } = require("../controller/auth.js");
const { userById } = require("../controller/user.js");
const { generateToken,processPayment} = require("../controller/braintree.js");


router.get('/braintree/getToken/:userId',requireSignin,isAuth,generateToken)
router.post('/braintree/payment/:userId',requireSignin,isAuth,processPayment)


router.param("userId",userById)
module.exports= router
