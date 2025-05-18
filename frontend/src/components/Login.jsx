import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance";

function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        new URLSearchParams({
            client_id:
                "417505674911-cucsknb4f8kpabe9nr63icfn5kn14on8.apps.googleusercontent.com",
            redirect_uri: "http://localhost:5000/auth/google/callback",
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "consent",
        }).toString();

    const handleLogin = async () => {
        const data = {
            userName,
            password,
        };

        try {
            const response = await toast.promise(
                axiosInstance.post("/login", data),
                {
                    loading: "Logging in...",
                    success: "Logged in successfully!",
                    error: "Login failed!",
                }
            );

            if (response.status === 200) {
                if (response.data.accessToken) {
                    localStorage.setItem(
                        "accessToken",
                        response.data.accessToken
                    );
                }
                toast.success("Redirecting to Todo...");
                setTimeout(() => navigate("/todo"), 1500);
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Invalid credentials or server error.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className=" p-8 rounded-2xl shadow-md w-full max-w-md bg-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6 ">Login</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        required
                        className="p-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        required
                        className="p-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
                    >
                        Log In
                    </button>
                </form>

                <div className="m-3">
                    <button
                        onClick={() => {
                            window.location.href = googleAuthUrl;
                        }}
                    >
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
