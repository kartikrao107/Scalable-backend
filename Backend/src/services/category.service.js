const { Prisma}=require("../config/db");
const createCategoryService=async(body)=>{
    const category=await Prisma.category.create({
        data:{
            name:body.name,
            desciption:body.desciption,
            image:body.image
        }
    });
return category;};
const getCategoriesService=async(body)=>{
    return await Prisma.category.findMany({
        orderBy:{createdAt:"desc"}
          
        
        
    });
};
const updateCategoryService=async(id,body)=>{
    return await Prisma.category.update({
        where:{
            id
        },
data:body
    });
};
const deleteCategoryService=async(id)=>{
    return await Prisma.category.delete({
        where:{id}
    });
};
module.exports={createCategoryService,getCategoriesService,updateCategoryService,deleteCategoryService};
