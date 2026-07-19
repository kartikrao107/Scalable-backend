const {signupservice,loginService}=require("../services/auth.service");
const signup=async(req,res)=>{
    try{
        const data=await signupservice(req.body);
        res.json({
success:true,...data
        });

    }
    catch (err){
        res.status(400).json({
            success:false,message:err.message
        });
    }
};
const login = async (req, res) => {

    try {

        const data = await loginService(req.body);

        res.json({

            success: true,

            ...data

        });

    }

    catch (err) {

        res.status(400).json({

            success: false,

            message: err.message

        });

    }

};

const profile = async (req, res) => {

    res.json({

        success: true,

        user: req.user

    });

};

module.exports = {

    signup,

    login,

    profile

};