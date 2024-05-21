import express from "express";
import cors from "cors";
import bodyPaser from "body-parser";
import router from "./src/router";

const app = express();
// middleware
app.use(cors());
app.use(bodyPaser.urlencoded({ extended: true }));
app.use(express.json());

//route
app.use("/api/v1", router);

// server port and start
app.listen("5000", () => console.log("server running on port 5000"));
