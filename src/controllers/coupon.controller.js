const {

    createCouponService,

    getCouponsService,

    applyCouponService,

    deleteCouponService

} = require("../services/coupon.services");

const createCoupon = async(req,res)=>{

    try{

        const coupon = await createCouponService(req.body);

        res.json({

            success:true,

            coupon

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

const getCoupons = async(req,res)=>{

    const coupons = await getCouponsService();

    res.json({

        success:true,

        coupons

    });

};

const applyCoupon = async(req,res)=>{

    try{

        const result = await applyCouponService(req.body);

        res.json({

            success:true,

            result

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

const deleteCoupon = async(req,res)=>{

    try{

        await deleteCouponService(req.params.id);

        res.json({

            success:true,

            message:"Coupon Deleted"

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

createCoupon,

getCoupons,

applyCoupon,

deleteCoupon

};