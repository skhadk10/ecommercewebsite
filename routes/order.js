const express = require("express");
const router = express.Router();

const { isAuth, requireSignin, isAdmin } = require("../controller/auth.js");
const { userSignupValidator } = require("../validator/index.js");
const {
  create,
  listOrders,
  getStatusValues,
  orderById,
  updateOrderStatus,
} = require("../controller/order.js");
const { userById, addOrderToUseHistory } = require("../controller/user.js");
const { decreaseQuantity } = require("../controller/product.js");

router.post(
  "/order/create/:userId",
  requireSignin,
  isAuth,
  addOrderToUseHistory,
  decreaseQuantity,
  create
);
router.put(
  "/order/:orderId/status/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  updateOrderStatus
);
router.get("/order/list/:userId", requireSignin, isAuth, isAdmin, listOrders);
router.get(
  "/order/status-values/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  getStatusValues
);
router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;
