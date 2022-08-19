const express = require("express");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth.js");
const router = express.Router();

const { create } = require("../controller/category.js");
const { userById } = require("../controller/user.js");
// admin can be able to create new category
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);
router.param("userId", userById);
module.exports = router;
