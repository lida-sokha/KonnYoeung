import { Link } from "react-router-dom";
import { useState } from "react";
import loginImage from "../../../public/images/login-removebg-preview.png";
import API from "../../services/api";

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const inputStyle = `w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await API.post("/users/forgot-password", { email });
            setMessage("Password reset link sent to your email.");
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex overflow-hidden bg-gray-50">

            {/* LEFT SIDE */}
            <div className="w-full lg:w-1/2 flex items-start justify-center px-6 pt-16 lg:pt-10">
                <div className="w-full max-w-xl bg-white p-8 lg:p-10 rounded-3xl shadow-2xl shadow-gray-200/50">

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/images/logo1.png" alt="KonnYoeung" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-sky-500 tracking-tight">
                                KonnYoeung
                            </span>
                        </Link>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Forgot Password
                    </h1>

                    <p className="text-gray-500 mb-6 text-sm">
                        Enter your email and we’ll send you a reset link.
                    </p>

                    {/* Error / Success */}
                    {error && (
                        <p className="mb-4 text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="mb-4 text-sm text-green-600 font-medium bg-green-50 p-3 rounded-lg">
                            {message}
                        </p>
                    )}

                    {/* FORM */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className={inputStyle}
                                required
                            />
                        </div>

                        <button
                            className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-sky-600 transition-all active:scale-[0.98]"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    {/* Back to login */}
                    <p className="mt-8 text-sm text-center text-gray-600">
                        Remember your password?{" "}
                        <Link to="/login" className="text-sky-500 font-bold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="hidden lg:flex w-1/2 items-start justify-center pt-10">
                <img
                    src={loginImage}
                    alt="Forgot Password"
                    className="w-4/5 max-w-3xl object-contain"
                />
            </div>
        </div>
    );
}