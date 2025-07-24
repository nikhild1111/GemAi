import express from "express";
import verifyToken from "../middlewares/verifyToken.js";
import { getHistory } from "../controllers/History.js";

const router = express.Router();

router.get("/history", verifyToken, getHistory); // select the code and enter ctrl + space to import the path of the file auto


export default router;
