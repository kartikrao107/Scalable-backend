const express=require("express");
const router=express.Router();
const auth=require("../middleware/auth");
const {createCart,getcart,updateCart,removeFromCart,clearCart}=require("../controllers/cart.controller");
router.post("/add",auth,createCart);
router.get("/getcart", auth, getcart);

router.put("/:itemId", auth, updateCart);

router.delete("/:itemId", auth, removeFromCart);

router.delete("/clear", auth, clearCart);
module.exports=router;
