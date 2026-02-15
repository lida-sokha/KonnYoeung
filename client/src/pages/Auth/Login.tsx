import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import loginImage from "../../../public/images/login-removebg-preview.png";
import API from "../../services/api";
import { HiIdentification } from "react-icons/hi";
import { CgPassword } from "react-icons/cg";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormDate] = useState({
    identifier: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDate({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/users/login", {
        email: formData.identifier,
        password: formData.password
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };
  const inputStyle = `w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all`;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">

      {/* LEFT SIDE – FORM */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-6 pt-16 lg:pt-10">
        <div className="w-full max-w-xl bg-white p-8 lg:p-10 rounded-3xl shadow-2xl shadow-gray-200/50">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Link to='/' className="flex items-center gap-3">
            <img src="/images/logo1.png" alt="KonnYoeung" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-sky-500 tracking-tight">
              KonnYoeung
              </span>
              </Link>
           </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
          {error && <p className="mb-4 text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username or email
              </label>
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter your username or email"
                className={inputStyle}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputStyle}
                required
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm text-sky-500 font-semibold hover:underline">
                Reset your password
              </a>
            </div>

            <button className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-sky-600 transition-all active:scale-[0.98]"
              type="submit"
              disabled={loading}
            >
              {loading? "Loggin in...": "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <hr className="border-gray-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-400 text-sm">or</span>
          </div>

          {/* Social Login */}
          <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 hover:bg-gray-50 font-medium transition-colors">
            <img src="/images/google_logo.png" className="h-5" alt="Google" />
            Continue with Google
          </button>

          <p className="mt-10 text-sm text-center text-gray-600">
            Don’t have account?{" "}
            <Link to="/signup" className="text-sky-500 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE – IMAGE */}
      <div className="hidden lg:flex w-1/2 items-start justify-center pt-10">
        <img
          src={loginImage}
          alt="Login Illustration"
          className="w-4/5 max-w-3xl object-contain"
        />
      </div>
    </div>
  );
}