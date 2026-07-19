const {

    placeOrderService,

    getOrdersService,

    getOrderService,

    cancelOrderService

} = require("../services/order.services");

const placeOrder = async(req,res)=>{

    try{

        const order = await placeOrderService(

            req.user.id,

            req.body

        );

        res.json({

            success:true,

            order

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

const getOrders = async(req,res)=>{

    const orders = await getOrdersService(req.user.id);

    res.json({

        success:true,

        orders

    });

};

const getOrder = async(req,res)=>{

    const order = await getOrderService(

        req.user.id,

        req.params.id

    );

    res.json({

        success:true,

        order

    });

};

const cancelOrder = async(req,res)=>{

    try{

        const order = await cancelOrderService(

            req.user.id,

            req.params.id

        );

        res.json({

            success:true,

            order

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

module.exports={

placeOrder,

getOrders,

getOrder,

cancelOrder

};