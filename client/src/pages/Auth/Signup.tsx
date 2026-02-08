import { useState } from "react";
import { useNavigate } from "react-router-dom"; // For redirecting
import signupImage from "../../../public/images/Login.png"; // Fix path as per above
import API from "../../services/api"
export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Signup.tsx
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await API.post("/users/signup", formData);

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/Dashboard");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    /* Full screen container with no overflow */
    <div className="h-screen w-screen flex overflow-hidden bg-white">

      {/* LEFT SIDE – FORM (Exactly 50%) */}
      <div className="w-full lg:w-1/2 h-full p-12 lg:p-24 flex flex-col justify-center bg-white">

        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 pt-15">
          <img src="/images/logo1.png" alt="KonnYoeung" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-sky-500 tracking-tight">
            KonnYoeung
          </span>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-left">Sign Up</h1>

        <div className="space-y-4 max-w-md">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-200 px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Create Account Button */}
        <div className="max-w-md">
          <form onSubmit={handleSubmit}>
            <button className="mt-8 w-full rounded-xl bg-sky-500 py-4 text-white font-bold text-lg hover:bg-sky-600 transition-all active:scale-[0.98]">
              Create Account
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center max-w-md">
          <hr className="border-gray-100" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-400 text-sm">or</span>
        </div>

        {/* Social Link */}
        <div className="max-w-md">
          <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 hover:bg-gray-50 font-medium transition-colors">
            <img src="/images/google_logo.png" className="h-5" alt="Google" />
            Continue with Google
          </button>
        </div>

        {/* Login link */}
        <p className="mt-8 text-sm text-center max-w-md text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-sky-500 font-bold hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* RIGHT SIDE – IMAGE (Exactly 50%) */}
      <div
        className="hidden lg:block lg:w-1/2 h-full"
        style={{
          backgroundImage: `url(${signupImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
    </div>
  );
}