import express from "express";
import { getUserList, userVerify } from "./controller"
const router = express.Router();

router.get('/',getUserList);
router.post('/login',userVerify);


export default router;
