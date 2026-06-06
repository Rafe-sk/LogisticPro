import express from 'express';
import { createUser, registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);   // POST /user/register  → sign up
router.post('/login',    loginUser);      // POST /user/login     → sign in
router.post('/create',   createUser);     // POST /user/create    → profile setup

export default router;