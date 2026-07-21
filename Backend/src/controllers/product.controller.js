console.log("CONTROLLER HIT");
//console.log(req.files);
const {

    createProductService,
    getProductsService,
    getProductService,
    updateProductService,
    deleteProductService

} = require("../services/product.service");

const createProduct = async (req,res)=>{
console.log(req.files);
    try{

        const product = await createProductService(req.body,req.user,req.files);

        res.json({

            success:true,

            product

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

const getProducts = async(req,res)=>{

    const products = await getProductsService(req.query);

    res.json({

        success:true,

        ...products

    });

};

const getProduct = async(req,res)=>{

    const product = await getProductService(req.params.id);

    res.json({

        success:true,

        product

    });

};

const updateProduct = async(req,res)=>{

    try{

        const product = await updateProductService(
            req.params.id,
            req.body,
            req.files
        );

        res.json({

            success:true,

            product

        });

    }

    catch(err){
    console.error(err);

    res.status(400).json({
        success:false,
        message:err.message,
        stack: err.stack
    });
}

};

const deleteProduct = async(req,res)=>{

    try{

        await deleteProductService(req.params.id);

        res.json({

            success:true,

            message:"Product Deleted"

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

createProduct,

getProducts,

getProduct,

updateProduct,

deleteProduct

};