import express from 'express';
import {createPickupAddress, createDeliveryAddress, getPickupAddress, getDeliveryAddress, updatePickupAddress, deletePickupAddress, updateDeliveryAddress, deleteDeliveryAddress} from '../controllers/addressController.js';

const router = express.Router();

router.post('/createPickupAddress',createPickupAddress)
router.post('/createDeliveryAddress',createDeliveryAddress)
router.get('/getPickupAddress',getPickupAddress)
router.get('/getDeliveryAddress',getDeliveryAddress)
router.post('/updatePickupAddress', updatePickupAddress)
router.post('/deletePickupAddress', deletePickupAddress)
router.post('/updateDeliveryAddress', updateDeliveryAddress)
router.post('/deleteDeliveryAddress', deleteDeliveryAddress)

export default router;