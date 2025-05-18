import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./connectDb.js";
import { Todo, User } from "./allSchemas.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authGoogle from "./router/authGoogle.js";

const app = express();

app.use(express.json());

dotenv.config();

connectDb();

app.use(
    cors({
        origin: "http://localhost:5173", // <-- your Vite dev‐server
        credentials: true, // <-- allow cookies
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(cookieParser());

app.use("/auth", authGoogle);

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log(token);

    if (!token) {
        return res.status(401).json({
            message: "Access token missing",
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid or expired access token",
            });
        }

        req.user = decoded;
        next();
    });
};

app.get("/api/me", verifyAccessToken, (req, res) => {
    console.log(req.user);
    res.json({
        user: { id: req.user.id, name: req.user.name, email: req.user.email },
    });
});

app.post("/login", async (req, res) => {
    try {
        const { userName, password } = req.body;

        if (!userName || !password) {
            return res.status(400).json({
                message: "Please provide all the credentials!!",
            });
        }
        console.log(userName);

        const user = await User.findOne({ name: userName });

        console.log(user);

        if (!user) {
            return res.status(400).json({
                message: "User does not EXIST !!",
            });
        }

        const comp = await bcrypt.compare(password, user.password);

        console.log(comp);

        if (!comp) {
            return res.status(401).json({
                message: "Wrong Password !!",
            });
        }

        // Generate tokens after password check
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);

        // Save refreshToken in user document (optional, but recommended)
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            message: "Successfully logged IN",
            accessToken,
        });
    } catch (error) {
        console.log("some error occured in login!! ", error);
        return res.status(500).json({
            message: " some internal error occcurred in login",
        });
    }
});

app.post("/newTodo", verifyAccessToken, async (req, res) => {
    try {
        const { data } = req.body;
        const userId = req.user.id;

        if (!data || !data.trim()) {
            return res.status(400).json({
                message: "Please provide the todo text.",
            });
        }

        // Create & save the new todo
        const todo = new Todo({
            data: data.trim(),
            userId,
        });
        await todo.save();

        // Fetch all todos for this user
        const todos = await Todo.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "New todo created successfully.",
            todos, // send the full list back
        });
    } catch (err) {
        console.error("Error in /newTodo:", err);
        return res.status(500).json({
            message: "Internal server error while creating todo.",
        });
    }
});
// In your server file (e.g. index.js or app.js)

app.get("/todos", verifyAccessToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all todos for this user, newest first
        const todos = await Todo.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({ todos });
    } catch (err) {
        console.error("Error in GET /todos:", err);
        return res.status(500).json({
            message: "Internal server error while fetching todos.",
        });
    }
});

const createAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};
const createRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );
};

app.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log(refreshToken);

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not found, login again!",
            });
        }
        console.log("reached here");

        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findOne({
            _id: payload.id,
            refreshToken: refreshToken,
        });

        if (!user)
            return res.status(403).json({ message: "Invalid refresh token" });

        const newAccessToken = createAccessToken(user);
        const newRefreshToken = createRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.log(
            `some error occured in the refresh api endpoint , error: \n${error}`
        );
        return res
            .status(403)
            .json({ message: "Invalid refresh token or expired" });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            res.status(400).json({
                message: "Please provide all the credentials",
            });
            return;
        }

        const userWithEmailExists = await User.findOne({ email });
        const userWithUserNameExists = await User.findOne({ name: userName });

        if (userWithEmailExists || userWithUserNameExists) {
            return res.status(400).json({
                message: "User exists with this username or email",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 5);

        const tempUser = {
            _id: new mongoose.Types.ObjectId(),
            name: userName,
            email: email,
        };

        const accessToken = createAccessToken(tempUser);
        const refreshToken = createRefreshToken(tempUser);

        const user = new User({
            _id: tempUser._id,
            name: userName,
            email: email,
            password: hashedPassword,
            refreshToken: refreshToken,
        });

        const resp = await user.save();

        console.log(`this is response from the User.save() : ${resp}`);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "everything is done successfully created a User",
            accessToken,
            // refreshToken,
        });
    } catch (error) {
        console.log("some error occured in signup!! ", error);
        return res.status(500).json({
            message: " some internal error occcurred",
        });
    }
});

app.listen(process.env.PORT, (req, res) => {
    console.log(`server is running in port: ${process.env.PORT}`);
});
