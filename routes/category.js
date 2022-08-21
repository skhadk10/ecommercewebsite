const express = require("express");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth.js");
const router = express.Router();

const { create,categoryById, read ,update,remove,list} = require("../controller/category.js");
const { userById } = require("../controller/user.js");

router.get("/category/:categoryId", read);
// admin can be able to create new category
router.post("/category/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/category/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove);
router.post("/categories", list);
router.param("categoryId", categoryById);
router.param("userId", userById);

module.exports = router;
