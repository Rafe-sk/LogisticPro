import express from 'express';
import {createOrder , getOrder}from '../controllers/orderController.js';

const router = express.Router();

router.post('/createOrder',createOrder)
router.get('/getOrder',getOrder)

export default router;