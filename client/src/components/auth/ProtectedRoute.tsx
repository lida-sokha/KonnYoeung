import { Navigate } from "react-router-dom";
import { useState, useEffect, type JSX } from "react";
import API from "../../services/api";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
        API.get("/users/check-auth")
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false));
    }, []);

    if (isAuth === null) return <div>Loading...</div>; // Wait for the check

    return isAuth ? children : <Navigate to="/login" />;
}