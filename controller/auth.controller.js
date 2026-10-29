import User from "../model/auth.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, domain, skills } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password should be at least 8 characters"
            });
        }
        const existuser = await User.findOne({ email });
        if (existuser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            password: hashedPassword,
            email,
            domain,
            skills
        });

        // Exclude password from response
        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userObj
        });

    } catch (e) {
        console.error("Register Error:", e.message);
        return res.status(500).json({
            success: false,
            message: e.message || "Internal server error"
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            user: userObj,
            token
        });
    } catch (e) {
        console.error("Login Error:", e.message);
        return res.status(500).json({
            success: false,
            message: e.message || "Internal Server Error"
        });
    }
};
