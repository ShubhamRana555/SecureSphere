import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { deactivateAccount, deleteAccount, getMyProfile, reactivateAccount, updateMyProfile, updatePassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get('/me', isLoggedIn, getMyProfile);

router.put('/me/update', isLoggedIn, upload.single("avatar"), updateMyProfile);
// The string "avatar" is the field name in your form-data (or frontend input) through which the image file is uploaded.

router.put('/me/update-password', isLoggedIn, updatePassword);

router.delete('/me/deactivate-account', isLoggedIn, deactivateAccount);

router.put('/me/reactivate-account', isLoggedIn, reactivateAccount);

router.delete('/me/delete-account', isLoggedIn, deleteAccount);

export default router;