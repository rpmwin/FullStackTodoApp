import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { User } from "../allSchemas.model.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// redirect user to Google
router.get("/google", (req, res) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
    }).toString();

    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// handle the google callback

router.get("/google/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send("No code provided");
    }

    console.log("got called here in the call back");

    try {
        const tokenResp = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            }).toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { id_token, access_token } = tokenResp.data;

        const userinfoResp = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        const {
            sub: googleId,
            email,
            name,
            picture: avatar,
        } = userinfoResp.data;

        // upsert user in mongoDB

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.create({
                googleId,
                email,
                name,
                avatar,
                password: "",
            });
        } else {
            user.email = email;
            user.name = name;
            user.avatar = avatar;
            await user.save();
        }

        // Issue our own JWTs
        const jwtPayload = { id: user._id, email: user.email, name: user.name };
        const appAccessToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
        const appRefreshToken = jwt.sign(
            jwtPayload,
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
        );

        // Store refresh token in user doc
        user.refreshToken = appRefreshToken;
        await user.save();

        // 4) Send tokens to client
        res.cookie("refreshToken", appRefreshToken, {
            httpOnly: true,
            sameSite: "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
            // secure: true in production
        });
        console.log("reached here tooooooooo");
        res.redirect(
            `http://localhost:5173/oauth-success?token=${appAccessToken}`
        );
    } catch (err) {
        console.error("Google OAuth error", err.response?.data || err);
        res.status(500).send("Authentication failed");
    }
});

export default router;
