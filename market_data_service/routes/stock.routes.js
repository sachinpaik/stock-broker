import express from "express";
import {loadStocksData} from "../controllers/stock.controller.js";

const router = express.Router();

router.get("/loadData", loadStocksData )


export default router;