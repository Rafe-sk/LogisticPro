import express from 'express';
import {createParcel, getParcels} from '../controllers/parcelController.js';

const router = express.Router();

router.post('/createParcel',createParcel)
router.get('/getParcels',getParcels)

export default router;