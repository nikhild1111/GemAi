import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/UserData.js";

export const getHistory = async (req, res) => {
    try {

        res.status(200).json({
            success: true,
            data: {
                1: "history 1"
            },
            message: "User history",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error during history fetch",
        });
    }
};
