const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const {Prisma}=require("../config/db");
const signupservice=async(body)=>{
    const{name,email,password}=body;
     const existingUser = await Prisma.user.findUnique({

        where: {

            email

        }

    });

    if (existingUser) {

        throw new Error("Email already exists");

    }
    const hashedpassword=await bcrypt.hash(password,10);
    const user=await Prisma.user.create({
data:{
    name:name,
    email:email,
    password:hashedpassword
}
    });
return {user};


};
const loginService = async (body) => {

    const {

        email,

        password

    } = body;

    const user = await Prisma.user.findUnique({

        where: {

            email

        }

    });

    if (!user) {

        throw new Error("User not found");

    }

    const match = await bcrypt.compare(

        password,

        user.password

    );

    if (!match) {

        throw new Error("Invalid credentials");

    }

    const token = jwt.sign(

        {

            id: user.id,

            role: user.role

        },

        process.env.JWT_SECRET,

        {

            expiresIn: "7d"

        }

    );

    return {

        token,

        user

    };

};
module.exports={signupservice,loginService};

