import express from "express";
import {
    addStockToWatchList,
    addWatchList,
    deleteStockFromWatchList,
    deleteWatchList, getWatchList, updateWatchList
} from "../controllers/watchlist.controller.js";


const router = express.Router();
router.get('/get',getWatchList)
router.post('/add',addWatchList)
router.patch('/update',updateWatchList)
router.post('/addStock',addStockToWatchList)
router.delete('/deleteStock',deleteStockFromWatchList)
router.delete('/delete',deleteWatchList)


export default router;