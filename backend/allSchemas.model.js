import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true, // ← adds `createdAt` and `updatedAt`
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
            // required: true,
            default: false,
            // enum: ['completed','pending']
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // ← adds `createdAt` and `updatedAt`
    }
);

export const Todo = mongoose.model("Todo", todoSchema);
