import { Link } from "react-router-dom";
import { useState } from "react";
import loginImage from "../../../public/images/login-removebg-preview.png";
import API from "../../services/api";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"; // Added icons

export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // New state

    const inputStyle = `w-full rounded-xl border border-gray-200 pl-11 pr-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await API.post("/users/forgot-password", { email });
            setMessage("We've sent a password reset link to your email.");
            setIsSubmitted(true); 
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong. Please check your email and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
            {/* LEFT SIDE */}
            <div className="w-full lg:w-1/2 flex items-start justify-center px-6 pt-20 lg:pt-10">
                <div className="w-full max-w-xl bg-white p-8 lg:p-10 rounded-3xl shadow-2xl shadow-gray-200/50">
                    
                    <div className="flex items-center gap-3 mb-8">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/images/logo1.png" alt="KonnYoeung" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-sky-500 tracking-tight">KonnYoeung</span>
                        </Link>
                    </div>

                    {!isSubmitted ? (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center lg:text-left">Forgot Password?</h1>
                            <p className="text-gray-500 mb-6 text-sm text-center lg:text-left">
                                No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
                            </p>

                            {error && (
                                <p className="mb-4 text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                                    {error}
                                </p>
                            )}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                    <Mail className="absolute left-4 top-[46px] text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@company.com"
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <button
                                    className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-sky-600 transition-all active:scale-[0.98] shadow-lg shadow-sky-200"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <div className="flex justify-center mb-6">
                                <div className="bg-green-100 p-4 rounded-full">
                                    <CheckCircle size={48} className="text-green-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
                            <p className="text-gray-500 mb-8">{message}</p>
                            <button 
                                onClick={() => setIsSubmitted(false)}
                                className="text-sky-500 font-semibold hover:underline flex items-center gap-2 mx-auto"
                            >
                                <ArrowLeft size={18} /> Resend link
                            </button>
                        </div>
                    )}

                    <p className="mt-8 text-sm text-center text-gray-600">
                        Back to{" "}
                        <Link to="/login" className="text-sky-500 font-bold hover:underline">Login</Link>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="hidden lg:flex w-1/2 items-start justify-center pt-10">
                <img src={loginImage} alt="Forgot Password" className="w-4/5 max-w-3xl object-contain" />
            </div>
        </div>
    );
}