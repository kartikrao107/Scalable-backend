const { Prisma } = require("../config/db");

const createAddressService = async(userId,body)=>{

    return await Prisma.address.create({

        data:{

            ...body,

            userId

        }

    });

};

const getAddressesService = async(userId)=>{

    return await Prisma.address.findMany({

        where:{

            userId

        }

    });

};

const updateAddressService = async(userId,id,body)=>{

    const address = await Prisma.address.findUnique({

        where:{id}

    });

    if(!address){

        throw new Error("Address not found");

    }

    if(address.userId !== userId){

        throw new Error("Unauthorized");

    }

    return await prisma.address.update({

        where:{id},

        data:body

    });

};

const deleteAddressService = async(userId,id)=>{

    const address = await Prisma.address.findUnique({

        where:{id}

    });

    if(!address){

        throw new Error("Address not found");

    }

    if(address.userId !== userId){

        throw new Error("Unauthorized");

    }

    await Prisma.address.delete({

        where:{id}

    });

};
module.exports={

createAddressService,

getAddressesService,

updateAddressService,

deleteAddressService

};