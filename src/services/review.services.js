const { Prisma } = require("../config/db");

const createReviewService = async(userId,body)=>{

    const {

        productId,

        rating,

        comment

    } = body;

    if(rating < 1 || rating > 5){

        throw new Error("Rating must be between 1 and 5");

    }

    const product = await Prisma.product.findUnique({

        where:{id:productId}

    });

    if(!product){

        throw new Error("Product not found");

    }

    const existing = await Prisma.review.findFirst({

        where:{

            userId,

            productId

        }

    });

    if(existing){

        throw new Error("You already reviewed this product");

    }

    return await Prisma.review.create({

        data:{

            rating,

            comment,

            userId,

            productId

        }

    });

};

const getReviewsService = async(productId)=>{

    return await Prisma.review.findMany({

        where:{

            productId

        },

        include:{

            user:{

                select:{

                    name:true

                }

            }

        }

    });

};

const updateReviewService = async(userId,id,body)=>{

    const review = await Prisma.review.findUnique({

        where:{id}

    });

    if(!review){

        throw new Error("Review not found");

    }

    if(review.userId !== userId){

        throw new Error("Unauthorized");

    }

    return await Prisma.review.update({

        where:{id},

        data:body

    });

};

const deleteReviewService = async(userId,id)=>{

    const review = await Prisma.review.findUnique({

        where:{id}

    });

    if(!review){

        throw new Error("Review not found");

    }

    if(review.userId !== userId){

        throw new Error("Unauthorized");

    }

    await Prisma.review.delete({

        where:{id}

    });

};

module.exports={

createReviewService,

getReviewsService,

updateReviewService,

deleteReviewService

};