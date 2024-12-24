import express from 'express';
import { createPayment, getPayment} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/createPayment',createPayment)
router.get('/getPayment',getPayment)

export default router;