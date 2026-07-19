const {Prisma }=require("../config/db");

const createProductService=async(body,user,files)=>{
    const images=files.map(file=>file.path);
   const {name,description,price,stock,brand,discount,categoryId}=body;
   const category=await Prisma.category.findUnique({
    where:{id:categoryId}
   });
if(!category){throw new Error("Category not found");}

    const product=await Prisma.product.create({
        data:
        {
            name,description,price:Number(price),stock:Number(stock),brand,discount:Number(discount||0),
            sellerId:user.id,
            categoryId,images

        },
        include:{
            seller:true,
            category:true
        }

        
    });
    return product;
};
const getProductsService = async (query) => {
   const page=Number(query.page)||1;
   const limit=Number(query.limit)||10;
   const skip=(page-1)*limit;
   const where={};
   if(query.search){
    where.OR[{
        name:{
            contains:query.search,
            mode:"insensitive"
        }
    },
       { description:{
contains:query.search,
mode:"insensitive"
        }},
        {
            brand:{
                contains:query.search,
                mode:"insensitive"
            }
        }
];
   }
   if(query.category){

    where.categoryId = query.category;

}

if(query.brand){

    where.brand = {

        contains: query.brand,

        mode: "insensitive"

    };

}

if(query.minPrice || query.maxPrice){

    where.price = {};

    if(query.minPrice){

        where.price.gte = Number(query.minPrice);

    }

    if(query.maxPrice){

        where.price.lte = Number(query.maxPrice);

    }

};let orderBy = {

    createdAt: "desc"

};

if (query.sort === "price_asc") {

    orderBy = {

        price: "asc"

    };

}

else if (query.sort === "price_desc") {

    orderBy = {

        price: "desc"

    };

}

else if (query.sort === "newest") {

    orderBy = {

        createdAt: "desc"

    };

}

else if (query.sort === "oldest") {

    orderBy = {

        createdAt: "asc"

    };

}
   const totalProducts=await Prisma.product.count({where});
   const products=await  Prisma.product.findMany({
    
    where,skip,
    take:limit,

        include: {

            seller: {

                select: {

                    id: true,

                    name: true,

                    email: true

                }

            },

            category: true

        },

        orderBy

    });
return {page,

        limit,

        totalProducts,

        totalPages: Math.ceil(totalProducts / limit),

        products};
};

const getProductService = async (id) => {

    const product = await Prisma.product.findUnique({

        where: {

            id

        },

        include: {

            seller: {

                select: {

                    id: true,

                    name: true,

                    email: true

                }

            },

            category: true,

            reviews: true

        }

    });

    if (!product) {

        throw new Error("Product not found");

    }

    return product;

};

const updateProductService = async (id, body) => {

    const product = await Prisma.product.findUnique({

        where: {

            id

        }

    });

    if (!product) {

        throw new Error("Product not found");

    }

    return await Prisma.product.update({

        where: {

            id

        },

        data: {

            ...body,

            price: body.price ? Number(body.price) : undefined,

            stock: body.stock ? Number(body.stock) : undefined,

            discount: body.discount
                ? Number(body.discount)
                : undefined

        },

        include: {

            category: true,

            seller: true

        }

    });

};

const deleteProductService = async (id) => {

    const product = await Prisma.product.findUnique({

        where: {

            id

        }

    });

    if (!product) {

        throw new Error("Product not found");

    }

    await Prisma.product.delete({

        where: {

            id

        }

    });

};

module.exports = {

    createProductService,

    getProductsService,

    getProductService,

    updateProductService,

    deleteProductService

};