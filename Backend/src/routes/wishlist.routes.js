console.log("wishlist.routes loaded");
const express=require("express");
const router=express.Router();
const auth=require("../middleware/auth");
const {

    addWishlist,

    getWishlist,

    removeWishlist

}=require("../controllers/wishlist.controller");
router.post("/addwishlist",auth,addWishlist);
//console.log("wishlist.routes loaded");

router.get("/test", (req, res) => {
  res.send("wishlist test");
});
router.get("/getwishlist",auth,getWishlist);
router.delete("/:id",auth,removeWishlist);
module.exports=router;