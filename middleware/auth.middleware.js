import jwt from "jsonwebtoken";
import User from "../model/auth.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                msg: "Authorization header is required"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        if (!token) {
            return res.status(401).json({
                msg: "Token is required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                msg: "User not found"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log("auth middleware error:", err.message);
        return res.status(401).json({
            msg: "Invalid or expired token",
            err: err.message
        });
    }
};
