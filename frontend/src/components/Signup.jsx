import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance.js";
import { getGoogleAuthUrl } from "../utils/GoogleAuth.jsx";


export default function Signup() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const googleAuthUrl = getGoogleAuthUrl();

    const handleSignup = async () => {
        try {
            const res = await toast.promise(
                axiosInstance.post("/signup", { userName, email, password }),
                {
                    loading: "Signing up...",
                    success: "Successfully signed up!",
                    error: "Signup failed. Try again.",
                }
            );

            if (res.data.accessToken) {
                localStorage.setItem("accessToken", res.data.accessToken);
                navigate("/todo");
            }
        } catch (err) {
            console.error("Signup error:", err);
            toast.error("Could not sign up.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-8 rounded-2xl shadow-md w-full max-w-md bg-gray-800">
                <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSignup();
                    }}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="text"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="p-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition duration-300 font-semibold"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="mb-2 text-gray-300">Or</p>
                    <button
                        onClick={() => {
                            window.location.href = googleAuthUrl;
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Sign up with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
  