const express = require("express");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth.js");
const router = express.Router();

const { userById } = require("../controller/user.js");
// we are using isAuth and isadmin 
// isAuth use garnako karand k ho vanda user ko id ra authorizations token vayo vanye ni aaru user ni herna milxa tesai le is Auth use garera tyo id vako user lai matra access dena khojyeko 
router.get("/secret/:userId", requireSignin,isAuth, isAdmin,  (req, res) => {
  console.log("hello")
  res.json({
    user: req.profile,
  });
});
router.param("userId", userById);

module.exports = router;
