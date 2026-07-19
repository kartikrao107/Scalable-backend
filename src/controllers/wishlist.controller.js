const {addwishlistservice,getwishlistservice,removewishlistservice}=require("../services/wishlist.service");
const addWishlist = async (req, res) => {

    try {

        const wishlist = await addwishlistservice(

            req.user.id,

            req.body.productId

        );

        res.json({

            success: true,

            wishlist

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

const getWishlist = async (req, res) => {

    const wishlist = await getwishlistservice(req.user.id);

    res.json({

        success: true,

        wishlist

    });

};

const removeWishlist = async (req, res) => {

    await removewishlistservice(req.params.id);

    res.json({

        success: true,

        message: "Removed"

    });

};

module.exports = {

    addWishlist,

    getWishlist,

    removeWishlist

};