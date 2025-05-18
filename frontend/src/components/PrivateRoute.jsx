import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import { useAuth } from "";
// useAuth
export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth();

    // While loading user, show a spinner or placeholder
    if (loading) {
        return <p>Loading…</p>;
    }

    // If not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated: render protected content
    return <>{children}</>;
}
