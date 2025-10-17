import express from "express";
import { register,login } from "../controller/authController.js";


const router = express.Router();

// Route d'inscription
router.post("/register", register);

router.post("/login", login );

router.post("/booking", b)

export default router;
