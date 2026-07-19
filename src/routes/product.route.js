const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const upload=require("../config/multer");

const {

    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct

} = require("../controllers/product.controller");

router.post(

    "/createProduct",

    auth,

    role("SELLER","ADMIN"),
    upload.array("images",5),

    createProduct

);

router.get("/getProducts", getProducts);

router.get("/getproduct/:id", getProduct);

router.put(

    "/updateproduct/:id",

    auth,

    role("SELLER","ADMIN"),

    updateProduct

);

router.delete(

    "/delete/:id",

    auth,

    role("SELLER","ADMIN"),

    deleteProduct

);

module.exports = router;