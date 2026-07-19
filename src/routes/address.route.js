const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    createAddress,

    getAddresses,

    updateAddress,

    deleteAddress

} = require("../controllers/address.controller");

router.post("/", auth, createAddress);

router.get("/", auth, getAddresses);

router.put("/:id", auth, updateAddress);

router.delete("/:id", auth, deleteAddress);

module.exports = router;