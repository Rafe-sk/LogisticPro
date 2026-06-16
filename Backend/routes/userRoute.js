import express from 'express';
import { createUser, registerUser, loginUser, requestPasswordReset, resetPassword } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);   // POST /user/register  → sign up
router.post('/login',    loginUser);      // POST /user/login     → sign in
router.post('/create',   createUser);     // POST /user/create    → profile setup
router.post('/requestReset', requestPasswordReset);  // POST /user/requestReset → generate reset token
router.post('/resetPassword', resetPassword);        // POST /user/resetPassword → verify token & reset

export default router;