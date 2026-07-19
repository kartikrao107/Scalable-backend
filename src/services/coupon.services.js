const { Prisma } = require("../config/db");

const createCouponService = async(body)=>{

    const {

        code,

        discount,

        expiryDate

    } = body;

    const existing = await Prisma.coupon.findUnique({

        where:{

            code

        }

    });

    if(existing){

        throw new Error("Coupon already exists");

    }

    return await Prisma.coupon.create({

        data:{

            code,

            discount:Number(discount),

            expiryDate:new Date(expiryDate)

        }

    });

};

const getCouponsService = async()=>{

    return await Prisma.coupon.findMany({

        orderBy:{

            createdAt:"desc"

        }

    });

};

const applyCouponService = async(body)=>{

    const {

        code,

        amount

    } = body;

    const coupon = await Prisma.coupon.findUnique({

        where:{

            code

        }

    });

    if(!coupon){

        throw new Error("Coupon not found");

    }

    if(!coupon.isActive){

        throw new Error("Coupon is inactive");

    }

    if(new Date() > coupon.expiryDate){

        throw new Error("Coupon expired");

    }

    const discountAmount =

        amount * coupon.discount / 100;

    const finalAmount =

        amount - discountAmount;

    return{

        originalAmount:amount,

        discount:discountAmount,

        finalAmount

    };

};

const deleteCouponService = async(id)=>{

    await Prisma.coupon.delete({

        where:{

            id

        }

    });

};

module.exports={

createCouponService,

getCouponsService,

applyCouponService,

deleteCouponService

};