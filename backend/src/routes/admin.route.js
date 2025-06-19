import {Router} from 'express';
import { deleteUserByAdmin, getAllUsers, getSingleUser, updateUserByAdmin } from '../controllers/admin.controller.js';
import { isAdmin } from '../middlewares/admin.middleware.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(isLoggedIn, isAdmin);

router.get("/users", getAllUsers);

router.get("/user/:userId", getSingleUser);

router.put("/user/:userId", updateUserByAdmin);

router.delete("/user/:userId", deleteUserByAdmin);

export default router;