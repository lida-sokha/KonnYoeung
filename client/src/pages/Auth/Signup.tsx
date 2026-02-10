import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "../../../public/images/login-removebg-preview.png";
import API from "../../services/api";
import { jwtDecode } from "jwt-decode";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error while typing
    setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // ✅ Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await API.post("/users/signup", formData);
      if (response.data.success) {
        navigate("/verify", { state: { email: formData.email } });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-50">

      {/* LEFT SIDE – FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">

        <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/images/logo1.png" className="h-10" />
            <span className="text-2xl font-bold text-sky-500">
              KonnYoeung
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-sky-400"
              required
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-sky-400"
              required
            />

            {/* Password */}
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-sky-400"
              required
            />

            {/* Confirm Password */}
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`w-full rounded-xl border px-4 py-3 focus:ring-2 ${error ? "border-red-400 focus:ring-red-400" : "focus:ring-sky-400"
                }`}
              required
            />

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold hover:bg-sky-600 transition"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-sky-500 font-semibold hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE – IMAGE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white">
        <img
          src={signupImage}
          alt="Signup"
          className=" max-w-md object-contain"
        />
      </div>

    </div>
  );
}
