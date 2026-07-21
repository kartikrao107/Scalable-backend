const {createCartservice,getCartservice,updateCartservice,removeCartItemService,clearCartService}=require("../services/cart.service");
const createCart=async(req,res)=>{
try{ 
    const cart=await createCartservice(req.user.id,req.body);
    res.json({success:true,message:"added to cart"});
}
catch(err){
    console.log(err);
    res.status(400).json({
        success:false,message:"failed to create"
    });
}
};
const getcart=async(req,res)=>{
    const cart=await getCartservice(req.user.id);
    res.json({

        success: true,

        cart

    });

};
const updateCart = async (req, res) => {

    try {

        const cart = await updateCartservice(

            req.params.itemId,

            req.body.quantity

        );

        res.json({

            success: true,

            cart

        });

    }
    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};
const removeFromCart = async (req, res) => {

    await removeCartItemService(req.params.itemId);

    res.json({

        success: true,

        message: "Item Removed"

    });

};

const clearCart = async (req, res) => {

    await clearCartService(req.user.id);

    res.json({

        success: true,

        message: "Cart Cleared"

    });

};
module.exports={createCart,getcart,updateCart,removeFromCart,clearCart};