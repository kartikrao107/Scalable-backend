const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    placeOrder,

    getOrders,

    getOrder,

    cancelOrder

} = require("../controllers/order.controller");

router.post("/", auth, placeOrder);

router.get("/", auth, getOrders);

router.get("/:id", auth, getOrder);

router.put("/:id/cancel", auth, cancelOrder);

module.exports = router;