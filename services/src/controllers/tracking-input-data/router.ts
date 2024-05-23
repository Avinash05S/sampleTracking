import express from "express";
import { Create }  from "./controller"

const router = express.Router();


router.put("/", Create)


export default router;
