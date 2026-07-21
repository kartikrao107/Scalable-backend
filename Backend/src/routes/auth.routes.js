const express=require("express");
console.log("AUTH ROUTES LOADED");
const router=express.Router();
const {signup,login,profile}=require("../controllers/auth.controller");
const auth=require("../middleware/auth");
router.post("/signup",signup);
router.post("/login",login);
router.get("/profile",auth,profile);
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register User
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User Registered
 */

router.post("/signup", signup);
module.exports=router;