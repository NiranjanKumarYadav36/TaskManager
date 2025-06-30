import { Request, Response } from "express";
import { queryDB } from "../config/db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerHandle = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body
    const tableName = "taskmanager.users"

    try {
        if (!username.trim() || !password.trim() || username.trim() == "" || password.trim() == "") {
            res.status(400).json({ message: "Provide all credentials" })
            return
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be greater or equal to 6 characters" })
            return
        }

        const userExists = await queryDB(`SELECT * FROM ${tableName} WHERE username = $1`, [username])

        if (userExists.length != 0) {
            res.status(409).json({ message: "Username already registered" })
            return
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const newUser = await queryDB(`INSERT INTO ${tableName} (username, password_hash) VALUES($1, $2)`, [username, hashedPassword])

        if (newUser) {
            res.status(201).json({ message: "Regsitered successfully!" })
            return
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        return
    }
};

export const loginHandle = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body
    const tableName = "taskmanager.users"

    try {
        if (!username || !password || username == "" || password == "") {
            res.status(400).json({ message: "Provide all credentials" })
            return
        }

        const userExists = await queryDB(`SELECT id, username, password_hash FROM ${tableName} WHERE username = $1`, [username])
        const user = userExists[0]

        const passwordMatch = await bcryptjs.compare(password, user["password_hash"])

        if (userExists.length == 0 || !passwordMatch) {
            res.status(400).json({ message: "Invalid username or password" })
            return
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000,
        });

        res.status(200).json({ message: "Login successful" });
        return
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
        return
    }
};

export const logoutHandle = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("token", {
            path: "/",
            httpOnly: true,
            sameSite: "none",
            secure: true
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
};

export const user = async (req: Request, res: Response): Promise<void> => {
    const user = (req as any).user;
    try {
        res.status(200).json({ username: user.username})
        return
    } catch (error) {
        res.status(500).json({ message: "internal server error" })
        console.log(error);
    }
};