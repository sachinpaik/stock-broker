import express from "express";
import {cancelOrder, getOrders, placeOrder} from "../controllers/order.controller.js";


const router = express.Router();
router.get('/getOrders',getOrders)
router.post('/placeOrder',placeOrder)
router.delete('/cancel/:orderId',cancelOrder)

export default router;