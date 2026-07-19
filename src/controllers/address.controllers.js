const {

    createAddressService,

    getAddressesService,

    updateAddressService,

    deleteAddressService

} = require("../services/address.services");

const createAddress = async(req,res)=>{

    try{

        const address = await createAddressService(

            req.user.id,

            req.body

        );

        res.json({

            success:true,

            address

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

const getAddresses = async(req,res)=>{

    const addresses = await getAddressesService(req.user.id);

    res.json({

        success:true,

        addresses

    });

};

const updateAddress = async(req,res)=>{

    try{

        const address = await updateAddressService(

            req.user.id,

            req.params.id,

            req.body

        );

        res.json({

            success:true,

            address

        });

    }

    catch(err){

        res.status(400).json({

            success:false,

            message:err.message

        });

    }

};

const deleteAddress = async(req,res)=>{

    try{

        await deleteAddressService(

            req.user.id,

            req.params.id

        );

        res.json({

            success:true,

            message:"Address Deleted"

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

createAddress,

getAddresses,

updateAddress,

deleteAddress

};