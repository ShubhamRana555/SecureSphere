import { User } from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const getMyProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

    if(!user){
        return res.status(404).json(
            new ApiError(404, "User not found")
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200, 
            user,
            "User profile fetched successfully"
        )
    )

});


export const updateMyProfile = asyncHandler(async (req, res) => {
// check if user exists
// if yes, take input fullName, username, avatar 
// handle avatar upload if provided
// update user profile with provided data using findByIdAndUpdate query
// return updated user profile

    const user = await User.findById(req.user._id).select("-password -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

    if(!user){
        return res.status(404).json(
            new ApiError(404, "User not found")
        );
    }

    const { fullname, username} = req.body;
    const updates = {};

    if(username) updates.username = username;
    if(fullname) updates.fullname = fullname;

    if (req.file) {
  console.log("✅ File received:", req.file.path);
} else {
  console.log("❌ No file received");
}

    // Handle avatar upload
    if(req.file){
        // Delete old avatar if it exists

        if (user.avatar?.public_id) {
            try {
            await cloudinary.uploader.destroy(user.avatar.public_id);
            } catch (error) {
            console.error("Failed to delete old avatar from Cloudinary", error.message);
            }
        }

        // Upload new avatar
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        updates.avatar = {
            url: cloudinaryResponse.secure_url,
            public_id: cloudinaryResponse.public_id,
        };

        // Delete the local file
        fs.unlinkSync(req.file.path);
    }

    // Apply updates to user profile
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
        select: "-password -forgotPasswordToken -forgotPasswordTokenExpiry -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
    });

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User profile updated successfully")
    );

});


export const updatePassword = asyncHandler(async (req, res) => {

    const { originalPassword, newPassword, confirmNewPassword} = req.body;
    if(!originalPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json(
            new ApiError(400, "Please provide old password, new password and confirm new password")
        );
    }

    if(originalPassword === newPassword) {
        return res.status(400).json(
            new ApiError(400, "New password cannot be the same as old password")
        );
    }

    if(newPassword !== confirmNewPassword) {
        return res.status(400).json(
            new ApiError(400, "New password and confirm new password do not match")
        );
    }

    const user = await User.findById(req.user._id).select("+password");
    if(!user){
        return res.status(404).json(
            new ApiError(404, "User not found")
        );  
    }

    // check if user knows the original password first
    const isOriginalPasswordMatch = await user.comparePassword(originalPassword);
    if(!isOriginalPasswordMatch) {
        return res.status(400).json(
            new ApiError(400, "Current password is incorrect")
        );
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Password updated successfully"
        )
    );
    
});


export const deactivateAccount = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);
    if(!user){
        return res.status(404).json(
            new ApiError(404, "User not found")
        );
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Account deactivated successfully"
        )
    );

});


export const deleteAccount = asyncHandler(async (req, res) => {

    const {confirm} = req.body;
    if(!confirm || confirm !== "DELETE"){
        return res.status(400).json(
            new ApiError(400, "Please confirm account deletion by providing 'DELETE' in the request body")
        );
    }

    await User.findByIdAndDelete(req.user._id);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Account deleted successfully"
        )
    );

});

