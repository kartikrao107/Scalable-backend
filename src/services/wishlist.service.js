const { Prisma } = require("../config/db");
//const [Parser]=require("../config/db");
const addwishlistservice=async(userId,productId)=>{
    const product=await Prisma.product.findUnique({
        where:{
            id:productId
        }
    });
if(!product){
    throw new Error("no product found");
}
const existing=await Prisma.Wishlist.findFirst({
    where:{
        userId,productId
    }
});
if(existing){
    throw new Error("already in wishlist");
}
return await Prisma.Wishlist.create({
    data:{
        userId,productId
    }
    
});
};
const getwishlistservice=async(userId)=>{
    return await Prisma.Wishlist.findMany({
        where:{
            userId
        },
        include:{
            product:true
        }
    });
};
const removewishlistservice=async(id)=>{
    return await Prisma.Wishlist.delete({
        where:{id}
    });
};
module.exports={addwishlistservice,getwishlistservice,removewishlistservice};