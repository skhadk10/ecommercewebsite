const express = require("express");
const router = express.Router();

const { create, productById, read,remove } = require("../controller/product.js");
const { requireSignin, isAuth, isAdmin } = require("../controller/auth.js");
const { userById } = require("../controller/user.js");

router.get("/product/read/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
