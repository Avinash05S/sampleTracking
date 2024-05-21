import express from "express";
import { HealthCheck } from "./controller";

const router = express.Router();
router.get("/health-check", HealthCheck);

export default router;
