require("dotenv").config();
const app=require("./src/app");
const PORT=process.env.PORT||3000;
const {connectdb}=require("./src/config/db");

connectdb().then(()=>{
app.listen(PORT,()=>{
    console.log(`server connected ${PORT}`);
});});


