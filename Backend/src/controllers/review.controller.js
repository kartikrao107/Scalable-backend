const {

    createReviewService,

    getReviewsService,

    updateReviewService,

    deleteReviewService

} = require("../services/review.services");

const createReview = async(req,res)=>{

    try{

        const review = await createReviewService(

            req.user.id,

            req.body

        );

        res.json({

            success:true,

            review

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

const getReviews = async(req,res)=>{

    const reviews = await getReviewsService(

        req.params.productId

    );

    res.json({

        success:true,

        reviews

    });

};

const updateReview = async(req,res)=>{

    try{

        const review = await updateReviewService(

            req.user.id,

            req.params.id,

            req.body

        );

        res.json({

            success:true,

            review

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

const deleteReview = async(req,res)=>{

    try{

        await deleteReviewService(

            req.user.id,

            req.params.id

        );

        res.json({

            success:true,

            message:"Review Deleted"

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

createReview,

getReviews,

updateReview,

deleteReview

};