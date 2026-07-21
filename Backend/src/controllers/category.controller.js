const {

    createCategoryService,
    getCategoriesService,
    updateCategoryService,
    deleteCategoryService

} = require("../services/category.service");

const createCategory = async (req, res) => {
 console.log("Controller Entered");
    try {

        const category = await createCategoryService(req.body);
console.log("Service Finished");

        res.json({

            success: true,

            category

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

const getCategories = async (req, res) => {

    const categories = await getCategoriesService();

    res.json({

        success: true,

        categories

    });

};

const updateCategory = async (req, res) => {

    try {

        const category = await updateCategoryService(

            req.params.id,

            req.body

        );

        res.json({

            success: true,

            category

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

const deleteCategory = async (req, res) => {

    try {

        await deleteCategoryService(req.params.id);

        res.json({

            success: true,

            message: "Category Deleted"

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {

    createCategory,
    getCategories,
    updateCategory,
    deleteCategory

};