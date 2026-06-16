import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode("logisticpro_secret_key");

// ── Register ──────────────────────────────────────────────────────────────────
export async function registerUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

    try {
        const existing = await userModel.findOne({ email });
        if (existing)
            return res.status(409).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ email, password: hashedPassword });

        const token = await new SignJWT({ userid: newUser._id.toString(), email: newUser.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(JWT_SECRET);

        return res.status(201).json({ token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Registration failed" });
    }
}

// ── Login ─────────────────────────────────────────────────────────────────────
export async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

    try {
        const user = await userModel.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid email or password" });

        const token = await new SignJWT({ userid: user._id.toString(), email: user.email, name: user.name || "" })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(JWT_SECRET);

        return res.status(200).json({ token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Login failed" });
    }
}

// ── Profile Setup (upsert profile details onto the auth record) ───────────────
export async function createUser(req, res) {
    const user = req.body;
    try {
        await userModel.findOneAndUpdate(
            { email: user.email },
            { $set: user },
            { upsert: true, new: true }
        );
        return res.status(201).json({ message: "User profile saved successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Some Problem" });
    }
}

// ── Request Password Reset ────────────────────────────────────────────────────
export async function requestPasswordReset(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token (6-digit code for simplicity)
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await userModel.findOneAndUpdate(
            { email },
            { $set: { resetToken, resetTokenExpiry } },
            { new: true }
        );

        return res.status(200).json({ 
            message: "Password reset email sent",
            resetToken // In production, send via email instead
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to request password reset" });
    }
}

// ── Reset Password ───────────────────────────────────────────────────────────
export async function resetPassword(req, res) {
    const { email, resetToken, newPassword } = req.body;
    if (!email || !resetToken || !newPassword) {
        return res.status(400).json({ message: "Email, reset token, and new password are required" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify reset token and expiry
        if (user.resetToken !== resetToken || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        await userModel.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword, resetToken: null, resetTokenExpiry: null } },
            { new: true }
        );

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to reset password" });
    }
}