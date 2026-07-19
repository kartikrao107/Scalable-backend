const {Prisma}=require("../config/db");
const createCartservice=async(userId,body)=>{
    const {productId,quantity}=body;
    const product=await Prisma.product.findUnique({
        where:{id:productId
             
        }
    });
    if(!product){
        throw new Error("product not found");
    }
     if (product.stock < quantity) {

        throw new Error("Insufficient stock");

    }
    let cart=await Prisma.cart.findUnique({
        where:{
            userId
        }
    });
    if(!cart){
        cart= await Prisma.cart.create({
            data:{
                userId
            }
        });
    }
    const existingitem=await Prisma.cartItemartItem.findFirst({
        where:{
            cartId:cart.id,
            productId
        }
    });
    if(existingitem){
        return await Prisma.cartItem.update({
            where:{
                id:existingitem.id
            },
            data:{
                quantity:existingitem.quantity+Number(quantity)
            }
        });
    } return await prisma.cartItem.create({

        data: {

            cartId: cart.id,

            productId,

            quantity: Number(quantity)

        }

    });

};
const getCartservice=async(userId)=>{
    return await Prisma.cart.findUnique({
        where:{
            userId
        },
        include:{items:{include:{
            product:true
        }}}
    });
};
const updateCartservice=async(itemId,quantity)=>{
return await Prisma.cartItem.update({
where:{id:itemId},data:{
   quantity: Number(quantity)
}
});
};
    
const removeCartItemService = async (itemId) => {

    await prisma.cartItem.delete({

        where: {

            id: itemId

        }

    });

};

const clearCartService = async (userId) => {

    const cart = await prisma.cart.findUnique({

        where: {

            userId

        }

    });

    if (!cart) {

        throw new Error("Cart not found");

    }

    await prisma.cartItem.deleteMany({

        where: {

            cartId: cart.id

        }

    });

}; module.exports={createCartservice,getCartservice,updateCartservice,removeCartItemService,clearCartService};
