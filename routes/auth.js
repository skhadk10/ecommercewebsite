const express = require("express");
const router = express.Router();

const { signup, signin, signout, requireSignin } = require("../controller/auth.js");
const { userSignupValidator } = require("../validator/index.js");

router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);


// router.get("/index", requireSignin, (req, res)=>{
//     res.send('hello there')
// })

module.exports = router;
