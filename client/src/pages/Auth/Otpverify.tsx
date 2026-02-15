import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api";

export default function Verify() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the email passed from the Signup page, or default to empty
    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        try {
            setLoading(true);
            await API.post("/users/resend-otp", { email });
            alert("A new code has been sent to your email!");
            setTimer(60); // Reset timer
            setCanResend(false);
        } catch (err: any) {
            setError("Failed to resend OTP. Try again later.");
        } finally {
            setLoading(false);
        }
    };
    const handleVerify = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await API.post("/users/verify-otp", { email, otp });

            if (response.data.success) {
                navigate("/Dashboard");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // flex items-center justify-center centers the content both horizontally and vertically
        <div className="h-screen w-screen flex items-center justify-center bg-gray-50 px-4">

            {/* Main Card Container */}
            <div className="w-full max-w-md bg-white p-8 lg:p-12 rounded-3xl shadow-xl shadow-gray-200/50 flex flex-col items-center">

                {/* Logo Section */}
                <div className="flex items-center gap-3 mb-10">
                    <img src="/images/logo1.png" alt="KonnYoeung" className="h-10 w-auto" />
                    <span className="text-2xl font-bold text-sky-500 tracking-tight">
                        KonnYoeung
                    </span>
                </div>

                {/* Text Section */}
                <div className="text-center w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Email</h1>
                    <p className="text-gray-500 mb-8">
                        Enter the 6-digit code sent to <br />
                        <span className="font-semibold text-sky-600">{email}</span>
                    </p>

                    {/* Form Section */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        <div className="text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-center text-3xl tracking-[0.5em] font-black placeholder:text-gray-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-sky-100 disabled:bg-sky-300"
                        >
                            {loading ? "Verifying..." : "Verify & Login"}
                        </button>
                    </form>

                    {/* Footer Section */}
                    <div className="mt-10 text-center">
                        <p className="text-gray-500 text-sm">
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                disabled={!canResend || loading}
                                onClick={handleResend}
                                className={`font-bold transition-colors ${canResend
                                    ? "text-sky-500 hover:text-sky-700"
                                    : "text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {canResend ? "Resend" : `Resend in ${timer}s`}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}