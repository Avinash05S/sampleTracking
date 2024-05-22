import express from "express";
import { getNodeForm, getNodes } from "./controller";

const router = express.Router();

router.get("/form-data", getNodeForm);
router.get("/mapping-nodes", getNodes);

export default router;
