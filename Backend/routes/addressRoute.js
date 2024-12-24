import express from 'express';
import {createPickupAddress, createDeliveryAddress, getPickupAddress, getDeliveryAddress} from '../controllers/addressController.js';

const router = express.Router();

router.post('/createPickupAddress',createPickupAddress)
router.post('/createDeliveryAddress',createDeliveryAddress)
router.get('/getPickupAddress',getPickupAddress)
router.get('/getDeliveryAddress',getDeliveryAddress)

export default router;