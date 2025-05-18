// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance.js";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount or when token changes, fetch the current user
    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const res = await axiosInstance.get("/api/me");
                if (isMounted) setUser(res.data.user);
            } catch {
                if (isMounted) setUser(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};