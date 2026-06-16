import express from 'express';
import {createOrder , getOrder, getOrderByOrderID, cancelOrder}from '../controllers/orderController.js';

const router = express.Router();

router.post('/createOrder',createOrder)
router.get('/getOrder',getOrder)
router.post('/getByOrderID', getOrderByOrderID)
router.post('/cancelOrder', cancelOrder)

export default router;