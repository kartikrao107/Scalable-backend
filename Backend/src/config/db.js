const {PrismaClient}=require("@prisma/client");
const Prisma=new PrismaClient();
async function connectdb() {
    try{
        await Prisma.$connect();
        console.log("connected");
    }
    catch (err){
        console.log(err);
        process.exit(1);
    }

}
module.exports={Prisma,connectdb};