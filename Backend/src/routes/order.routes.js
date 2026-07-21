const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const {

    placeOrder,

    getOrders,

    getOrder,

    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderById

} = require("../controllers/order.controller");

router.post("/", auth, placeOrder);

router.get("/", auth, getOrders);

router.get("/:id", auth, getOrder);
router.put(
    "/admin/:id/status",
    auth,
    role("ADMIN"),
    updateOrderStatus
);
router.put("/:id/cancel", auth, cancelOrder);
router.get("/admin/all", auth, role("ADMIN"), getAllOrders);
router.get("/admin/:id", auth, role("ADMIN"), getOrderById);
module.exports = router;