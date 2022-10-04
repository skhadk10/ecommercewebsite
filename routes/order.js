const express = require("express");
const router = express.Router();

const {  isAuth, requireSignin,isAdmin } = require("../controller/auth.js");
const { userSignupValidator } = require("../validator/index.js");
const {create,listOrders}= require("../controller/order.js")
const {userById,addOrderToUseHistory}= require("../controller/user.js")
const {decreaseQuantity}= require("../controller/product.js")

router.post(
    "/order/create/:userId",
    requireSignin,
    isAuth,
    addOrderToUseHistory,
    decreaseQuantity,
    create
);
router.get('/order/list/:userId',  requireSignin,
isAuth, isAdmin, listOrders)
router.param("userId", userById)

module.exports = router
