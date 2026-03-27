import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import signupImage from "../../../public/images/login-removebg-preview.png";
import API from "../../services/api";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const loadToast = toast.loading("Creating account...");

    try {
      const response = await API.post("/users/signup", formData);
      if (response.data.success) {
        toast.success("OTP sent to your email!", { id: loadToast });
        navigate("/verify", { state: { email: formData.email } });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Signup failed";
      toast.error(msg, { id: loadToast });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded: any = jwtDecode(credentialResponse.credential);
      const res = await API.post("/users/google-login", {
        email: decoded.email,
        fullName: decoded.name,
        googleId: decoded.sub
      });

      if (res.data.success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error("Google Login failed. Please try again.");
    }
  };

  const inputStyle = `w-full rounded-xl border border-gray-200 pl-12 pr-12 py-4 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all`;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      <div className="w-full lg:w-1/2 flex items-start justify-center px-6 lg:pt-10 pt-16">
        <div className="w-full max-w-xl bg-white p-8 lg:p-10 rounded-3xl shadow-2xl shadow-gray-200/50">
          
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo1.png" alt="Logo" className="h-10" />
              <span className="text-2xl font-bold text-sky-500">KonnYoeung</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Join us to start managing your health.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={inputStyle}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={inputStyle}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={inputStyle}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={inputStyle}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold hover:bg-sky-600 transition-all active:scale-[0.98] shadow-lg shadow-sky-200 disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <hr className="border-gray-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-400 text-sm">or</span>
          </div>

          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google Login Failed")}
              theme="outline"
              shape="pill"
              width="380px"
            />
          </div>

          <p className="text-sm text-center mt-8 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-500 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-start justify-center pt-10">
        <img src={signupImage} alt="Signup" className="w-4/5 max-w-2xl object-contain" />
      </div>
    </div>
  );
}