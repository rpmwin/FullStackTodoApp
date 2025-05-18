// src/components/OAuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthSuccess() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get("token");
        console.log(token);
        if (token) {
            localStorage.setItem("accessToken", token);
            console.log("got ppassed thorugh here");
            navigate("/todo");
        } else {
            // navigate("/login");
        }
    }, []);

    return <p>Logging you in…</p>;
}
