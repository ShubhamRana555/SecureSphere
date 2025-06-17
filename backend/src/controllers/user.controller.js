import { User } from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import ApiResponse from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";

export const getMyProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select("-password -forgotPasswordToken -forgotPasswordExpiry refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

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

