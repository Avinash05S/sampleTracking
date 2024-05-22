import express from "express";
import cors from "cors";
import bodyPaser from "body-parser";
import router from "./src/router";
import { v4 } from "uuid";

(() => {
  try {
    console.log(v4());
    const app = express();
    app.use(cors());
    app.use(bodyPaser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use("/api/v1", router);
    app.use("*", (req, res) => res.status(400).send("NOT FOUND"));
    require("./src/shared/db");
    app.listen("5000", () => console.log("server running on port 5000"));
  } catch (err) {
    console.error(err);
  }
})();
