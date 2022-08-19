const express = require("express");
const router = express.Router();
 
const { create } = require("../controller/product.js");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth.js");
const { userById } = require("../controller/user.js");
 
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
 
router.param("userId", userById);
module.exports = router;
