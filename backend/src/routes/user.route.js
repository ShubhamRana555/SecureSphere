import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { deactivateAccount, deleteAccount, getMyProfile, updateMyProfile, updatePassword } from "../controllers/user.controller.js";

const router = Router();


router.get('/me', isLoggedIn, getMyProfile);

router.put('/me/update', isLoggedIn, updateMyProfile);

router.put('/me/update-password', isLoggedIn, updatePassword);

router.delete('/me/deactivate-account', isLoggedIn, deactivateAccount);

router.delete('/me/delete-account', isLoggedIn, deleteAccount);

export default router;