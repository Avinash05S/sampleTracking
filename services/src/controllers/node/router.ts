import express from "express";
import {
  getNodeForm,
  getNodes,
  getUserTracking,
  defaultNodeCreate,
  mappingNodeCreate,
} from "./controller";

const router = express.Router();

router.get("/form-data", getNodeForm);
router.get("/mapping-nodes", getNodes);
router.get("/node-tracking", getUserTracking);
router.post("/create/mapping", mappingNodeCreate);
router.post("/create/default", defaultNodeCreate);

export default router;
