import React, { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "./axiosInstance"; // Use your custom Axios instance

function Signup() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleSignup = async () => {
        const data = {
            userName,
            email,
            password,
        };

        try {
            const res = await toast.promise(
                axiosInstance.post("/signup", data),
                {
                    loading: "Signing up...",
                    success: "Successfully signed up!",
                    error: "Signup failed. Try again.",
                }
            );
            if (res.data.accessToken) {
                localStorage.setItem("accessToken", res.data.accessToken);
            }
            console.log("Signup response:", res.data);
        } catch (err) {
            console.error("Signup error:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="rounded-2xl shadow-md p-9 w-full  bg-gray-800">
                <h1 className="text-3xl font-bold text-center mb-6 ">
                    Sign Up
                </h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSignup();
                    }}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="p-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 text-lg rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
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
            </div>
        </div>
    );
}

export default Signup;
