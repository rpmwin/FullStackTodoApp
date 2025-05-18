import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance";
import { getGoogleAuthUrl } from "../utils/GoogleAuth";


export default function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const googleAuthUrl = getGoogleAuthUrl();

    const handleLogin = async () => {
        try {
            const res = await toast.promise(
                axiosInstance.post("/login", { userName, password }),
                {
                    loading: "Logging in...",
                    success: "Logged in successfully!",
                    error: "Login failed!",
                }
            );

            if (res.data.accessToken) {
                localStorage.setItem("accessToken", res.data.accessToken);
            }
            toast.success("Redirecting to Todo...");
            setTimeout(() => navigate("/todo"), 1500);
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Invalid credentials or server error.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-8 rounded-2xl shadow-md w-full max-w-md bg-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
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
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
                    >
                        Log In
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
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
  
