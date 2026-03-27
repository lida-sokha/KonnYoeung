import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import loginImage from "../../../public/images/login-removebg-preview.png";
import API from "../../services/api";
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from 'react-hot-toast';

const ConfirmNewPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const inputStyle = `w-full rounded-xl border border-gray-200 pl-11 pr-12 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all`;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading("Updating password...");

        try {
            const response = await API.put(`/users/reset-password/${resetToken}`, { password });
            
            if (response.data.success) {
                toast.success("Password updated successfully!", { id: loadingToast });
                setIsSuccess(true);
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Link expired or invalid.";
            toast.error(errorMessage, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
            <div className="w-full lg:w-1/2 flex items-start justify-center px-6 pt-20 lg:pt-10">
                <div className="w-full max-w-xl bg-white p-8 lg:p-10 rounded-3xl shadow-2xl shadow-gray-200/50">
                    
                    <div className="flex items-center gap-3 mb-8">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/images/logo1.png" alt="KonnYoeung" className="h-10 w-auto" />
                            <span className="text-2xl font-bold text-sky-500 tracking-tight">KonnYoeung</span>
                        </Link>
                    </div>

                    {!isSuccess ? (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Set New Password</h1>
                            <p className="text-gray-500 mb-6 text-sm">
                                Enter a strong password to secure your account.
                            </p>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* NEW PASSWORD INPUT */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                    <Lock className="absolute left-4 top-[46px] text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={inputStyle}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[46px] text-gray-400 hover:text-sky-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {/* CONFIRM PASSWORD INPUT */}
                                <div className="relative">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                    <Lock className="absolute left-4 top-[46px] text-gray-400" size={20} />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={inputStyle}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-[46px] text-gray-400 hover:text-sky-500 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <button
                                    className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-sky-600 transition-all active:scale-[0.98] shadow-lg shadow-sky-200"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Reset Password"}
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
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Updated!</h2>
                            <p className="text-gray-500 mb-8">Your password has been changed successfully. You will be redirected to the login page shortly.</p>
                            <Link
                                to="/login"
                                className="text-sky-500 font-semibold hover:underline flex items-center gap-2 mx-auto justify-center"
                            >
                                <ArrowLeft size={18} /> Back to Login
                            </Link>
                        </div>
                    )}

                    {!isSuccess && (
                        <p className="mt-8 text-sm text-center text-gray-600">
                            Remember your password?{" "}
                            <Link to="/login" className="text-sky-500 font-bold hover:underline">Login</Link>
                        </p>
                    )}
                </div>
            </div>

            <div className="hidden lg:flex w-1/2 items-start justify-center pt-10">
                <img src={loginImage} alt="Reset Password" width={600} height={600} className="w-4/5 max-w-3xl object-contain" />
            </div>
        </div>
    );
}

export default ConfirmNewPassword;