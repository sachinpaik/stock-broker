import express from "express";
import getMarketData from "../controllers/marketData.controller.js";

const marketRouter = express.Router();

marketRouter.get("/get", getMarketData )


export default marketRouter;