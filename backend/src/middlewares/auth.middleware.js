import jwt  from 'jsonwebtoken';
import asyncHandler from '../utils/async-handler.js';
import { User } from '../models/user.model.js';
import ApiError from '../utils/api-error.js';

//  TODO: MAKE USE OF ACCESS TOKEN INSTEAD OF REFRESH TOKEN, WHICH WILL COME FROM FRONTEND AS A HEADER
export const isLoggedIn = asyncHandler(async (req, res, next) => {
    const authHeader = req.header('Authorization');
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json(
      new ApiError(401, 'You are not logged in! Please log in to get access.')
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json(new ApiError(401, 'User no longer exists.'));
    }

    if (!user.isActive && !req.originalUrl.includes("/reactivate-account") && !req.originalUrl.includes("/users/me")) {
      throw new ApiError(403, "Account is deactivated. Reactivate your account to continue.");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json(new ApiError(401, 'Invalid or expired token.'));
  }

})


export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.refreshToken;

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "You are not logged in",
        });
    }

    try {
        const decoded = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);

        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        }); 
    }

})

