import ApiError from '../utils/api-error.js';
import ApiResponse from '../utils/api-response.js';
import asyncHandler from '../utils/async-handler.js';
import { User } from '../models/user.model.js';
import { emailVerificationMailGenContent, forgotPasswordMailGenContent, sendMail } from '../utils/mail.js';
import crypto from "crypto"

export const registerUser = asyncHandler(async (req, res) => {
    // validation --> done in middleware
  // check if user already exists
  // if not exists, encrypt password using bcrypt
  //  create a new user and save to db
  // create verification token using crypto.randomBytes
  // send verification email using nodemailer
  // send response

    const {email, password, username, role} = req.body;
    if(!email || !password || !username || !role) {
        return res.status(400).json(
            new ApiError(400, "Email is required")
        ) 
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json(
            new ApiError(400, "User already exists with this email")
        ) 
    }

    const user = await User.create({email, username, password, role});

    const { hashedToken, unHashedToken, tokenExpiry } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    await user.save();

    // send verification mail via nodemailer
    const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email/${unHashedToken}`;
    console.log("Token", unHashedToken);

    await sendMail({
        email: user.email,
        subject: "Email verification for user authentication for SecureSphere App",
        mailGenContent: emailVerificationMailGenContent(user.username, verificationUrl), 
    });

    return res.status(201).json(
        new ApiResponse(201, 'User registered successfully. Please check your email to verify your account.')
    )

})

export const verifyEmail = asyncHandler(async (req, res) => {
    const {token} = req.params;
    
    if(!token){
        return res.status(400).json(
            new ApiError(400, "Token is required")
        ) 
    }
   
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiry: {$gt: Date.now()},
    })

    if(!user){
        return res.status(400).json(
            new ApiError(400, "Invalid or expired token")
        )
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, user, "Email verified successfully")
    )

})


export const resendVerificationEmail = asyncHandler(async (req, res) => {
    const {email} = req.body;
    if(!email){
        res.status(400).json(
            new ApiError(400, "Email is required")
        )
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json(
            new ApiError(400, "User not found with this email")
        )
    }

    if(user.isEmailVerified){
        return res.status(400).json(
            new ApiError(400, "Email is already verified")
        )
    }

    const { hashedToken, unHashedToken, tokenExpiry} = user.generateTemporaryToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    await user.save();

    // send verification mail via nodemailer
    const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify-email/${unHashedToken}`;
    console.log("Verification Token", unHashedToken);

    await sendMail({
        email: user.email,
        subject: "Resend Email verification for user authentication for SecureSphere App",
        mailGenContent: emailVerificationMailGenContent(user.username, verificationUrl),
    })

    return res.status(200).json(
        new ApiResponse(200, null, 'Verification email sent successfully. Please check your email to verify your account.')
    )
})


export const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json(
            new ApiError(400, "Email and password are required")
        )
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json(
            new ApiError(400, "User not found with this email")
        )
    }

    const isMatched = await user.comparePassword(password);
    if(!isMatched){
        return res.status(400).json(
            new ApiError(400, "Invalid credentials")
        )
    }

    if(!user.isEmailVerified){
        return res.status(400).json(
            new ApiError(400, "Email is not verified. Please verify your email to login.")
        )
    }

    // generate JWT token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24*60*60*1000
    });

    return res.status(200).json(
        new ApiResponse(200, {
            accessToken,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
            }
        }, "User logged in successfully")
    )

});


export const logoutUser = asyncHandler(async(req, res) => {
    res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    });


    res.status(200).json(
        new ApiResponse(200, null, "User logged out successfully")
    )
})


export const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json(
            new ApiError(400, "Email is required")
        )
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json(
            new ApiError(400, "User not found with this email")
        )
    }

    const { hashedToken, unHashedToken, tokenExpiry} = user.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = tokenExpiry;

    await user.save();

    const forgotPasswordUrl = `${process.env.BASE_URL}/api/v1/auth/reset-password/${unHashedToken}`;
    console.log("Forgot Password Token", unHashedToken);

    await sendMail({
        email: user.email,
        subject: "Password reset request for SecureSphere App",
        mailGenContent: forgotPasswordMailGenContent(user.username, forgotPasswordUrl),
    });

    return res.status(200).json(
        new ApiResponse(200, null, "Password reset email sent successfully. Please check your email to reset your password.")
    )

})


export const resetPassword = asyncHandler(async (req, res) => {
    const {token} = req.params;
    const {password, confirmPassword} = req.body;

    if(!token || !password || !confirmPassword){
        return res.status(400).json(
            new ApiError(400, "Token, password and confirm password are required")
        )
    }

    if(password !== confirmPassword){
        return res.status(400).json(
            new ApiError(400, "Password and confirm password do not match")
        )
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: {$gt: Date.now()},
    });

    if(!user){
        return res.status(400).json(
            new ApiError(400, "Invalid or expired token")
        )
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiry = undefined;

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, null, "Password reset successfully. You can now login with your new password.")
    )

})


export const refreshAccessToken = asyncHandler(async (req, res) => {
    const user = req.user;

    if(!user){
        return res.status(401).json(
            new ApiError(401, "Unauthorized")
        )
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return res.status(200).json(
        new ApiResponse(
            200, 
            {
                accessToken,
                user: {
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                }
            }
        )
    )

})
