const express=require("express");
const router=express.Router();
const auth=require("../middleware/auth");
const role=require("../middleware/role");
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} = require("../controllers/category.controller");
router.post("/createCategory",auth,role("ADMIN"),createCategory);
router.get("/getCategories",getCategories);
router.put(

    "/:id",

    auth,

    role("ADMIN"),

    updateCategory

);

router.delete(

    "/:id",

    auth,

    role("ADMIN"),

    deleteCategory

);
module.exports=router;