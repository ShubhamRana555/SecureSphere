
import { Router } from 'express';
import { forgotPassword, loginUser, logoutUser, refreshAccessToken, registerUser, resendVerificationEmail, resetPassword, verifyEmail } from '../controllers/auth.controller.js';
import { isLoggedIn, verifyRefreshToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);

router.get('/verify-email/:token', verifyEmail);

router.post('/verify-email', resendVerificationEmail);

router.post('/login', loginUser);

router.post('/logout', isLoggedIn, logoutUser);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password/:token', resetPassword);

router.get('/refresh-token', verifyRefreshToken, refreshAccessToken);

export default router;