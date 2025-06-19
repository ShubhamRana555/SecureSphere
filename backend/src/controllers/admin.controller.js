import asyncHandler from "../utils/async-handler.js";
import {User} from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";


export const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

    if(!users || users.length === 0) {
        return res.status(404).json(
            new ApiError(404, "No users found")
        );
    }


    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    );
})


export const getSingleUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    if(!userId) {
        return res.status(400).json(
            new ApiError(400, "User ID is required")
        );
    }
    const user = await User.findById(userId).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

    if(!user) {
        return res.status(404).json(
            new ApiError(404, "User not found")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );


})


export const updateUserByAdmin = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    if(!userId){
        return res.status(400).json(
            new ApiError(400, "User Id is required")
        )
    }

    const {username, fullname, role, isActive } = req.body;
    if(!username || !fullname || !role || !isActive){
        return res.status(400).json(
            new ApiError(400, "username, fullname and role are not entered properly")
        )
    }

    // create object to pass to database query
    const updates = {};
    if(username) updates.username = username;
    if(fullname) updates.fullname = fullname;
    if(role) updates.role = role;
    if(isActive) updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
        select: "-password -refreshToken -forgotPasswordToken -forgotPasswordTokenExpiry -emailVerificationToken -emailVerificationTokenExpiry"
    })

    if(!user){
        return res.status(404).json(
            new ApiError(404, "User not found")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, "User updated successfully by admin")
    )
})


export const deleteUserByAdmin = asyncHandler(async (req, res) => {

    const { userId } = req.params;
    if(!userId){
        return res.status(400).json(
            new ApiError(400, "User Id is required")
        )
    }

    const user = await User.findById(userId).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

    // Delete avatar from Cloudinary
  if (user.avatar?.public_id) {
    try {
      const { v2: cloudinary } = await import("cloudinary");
      await cloudinary.uploader.destroy(user.avatar.public_id);
    } catch (error) {
      console.error("Failed to delete user avatar from Cloudinary", error.message);
    }
  }

  await User.findByIdAndDelete(userId);

  return res.status(200).json(
    new ApiResponse(200, null, "User deleted successfully")
  );

})