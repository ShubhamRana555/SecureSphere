import ApiError from "../utils/api-error.js";

export const isAdmin = (req, res, next) => {
    if(!req.user || req.user.role !== "admin") {
        return res.status(403).json(
            new ApiError(403, "Access denied. Admins only.")
        );
    }
    next();
}