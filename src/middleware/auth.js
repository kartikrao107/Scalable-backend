const jwt=require("jsonwebtoken");
const { Prisma } = require("../config/db");
const auth=async(req,res,next)=>{
    try{
    const data=await req.headers.authorization;
   /* if(!data || !data.startsWith("Bearer")){
        return res.status(401).json({
            success:false,message:"unauthorized"
        });
    }
    const token=data.split(" ")[1];*/
    const decoded=await jwt.verify(data,process.env.JWT_SECRET);
     const user = await Prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        });
         if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        } req.user=user;
        next();


    }  catch (err) {

        return res.status(401).json({

            success: false,

            message: "Invalid Token"

        });

    }

};
module.exports=auth;