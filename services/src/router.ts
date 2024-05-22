import express from "express";
import { HealthCheck, Node, Tracking, User } from "./controllers";

const router = express.Router();
router.use("/health-check", HealthCheck);
router.use("/node", Node);
router.use("/tracking", Tracking);
router.use("/user", User);

export default router;
