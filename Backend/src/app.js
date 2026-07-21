const express=require("express");
const cors=require("cors");
const helmet=require("helmet");
const compression=require("compression");
const cookieparser=require("cookie-parser");
const authroutes=require("./routes/auth.routes");
const categoryroute=require("./routes/category.route");
const productroute=require("./routes/product.route");
const cartroute=require("./routes/cart.route");
const wishlistroute=require("./routes/wishlist.routes");
const review=require("./routes/review.route");
const coupon=require("./routes/coupon.route");
const orderroute=require("./routes/order.routes");
const addressroute=require("./routes/address.route");
const {

    swaggerUi,

    specs

} = require("./config/swagger");
const app=express();


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(cookieparser());
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
    res.json({success:true,message:"running"});
});
/*app.use(

    "/api-docs",

    swaggerUi.serve,

    swaggerUi.setup(specs)

);*/console.log("App initialized");
app.use("/api/auth",authroutes);
console.log("Auth routes mounted");
app.use("/api/product",productroute);
app.use("/api/address",addressroute);
app.use("/api/category",categoryroute);
app.use("/api/cart",cartroute);
app.use("/api/wishlist",wishlistroute);
app.use("/api/review",review);
app.use("/api/coupon",coupon);
app.use("/api/orders",orderroute);
module.exports=app;