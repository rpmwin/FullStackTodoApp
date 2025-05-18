import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            // required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        avatar: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        password: {
            type: String,
            // only required for users signing up with email+password
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt
    }
);

export const User = mongoose.model("User", userSchema);

const todoSchema = new mongoose.Schema(
    {
        data: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Todo = mongoose.model("Todo", todoSchema);
