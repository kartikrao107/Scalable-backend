const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const {

    createCoupon,

    getCoupons,

    applyCoupon,

    deleteCoupon

} = require("../controllers/coupon.controller");

router.post(

    "/createCoupon",

    auth,

    role("ADMIN"),

    createCoupon

);

router.get("/getCoupons", auth, getCoupons);

router.post("/apply", auth, applyCoupon);

router.delete(

    "/:id",

    auth,

    role("ADMIN"),

    deleteCoupon

);

module.exports = router;