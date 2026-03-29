import { Navigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";
import API from "../../services/api";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuth(false);
            return;
        }

        API.get("/users/check-auth")
            .then(() => setIsAuth(true))
            .catch(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setIsAuth(false);
            });
    }, []);

    if (isAuth === null) {
        return localStorage.getItem("token") ? <div>Loading...</div> : <Navigate to="/login" />;
    }

    return isAuth ? children : <Navigate to="/login" />;
}