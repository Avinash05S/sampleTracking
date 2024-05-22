import express from "express";
import { Upsert, getTrackingList } from "./controller";

const router = express.Router();

router.get('/', getTrackingList)
router.put("/", Upsert);

export default router;
