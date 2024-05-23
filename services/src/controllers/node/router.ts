import express from "express";
import { getNodeForm, getNodes, getUserTracking } from "./controller";

const router = express.Router();

router.get("/form-data", getNodeForm);
router.get("/mapping-nodes", getNodes);
router.get("/node-tracking", getUserTracking);

export default router;
