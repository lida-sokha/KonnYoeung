import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Use Link for internal routing
import signupImage from "../../../public/images/login-removebg-preview.png";
import API from "../../services/api";

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
    setError("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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

  // Common styles for inputs to keep the code clean
  const inputStyle = `w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all`;

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* LEFT SIDE – FORM */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-6 bg-white lg:pt-20 pt-20">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img src="/images/logo1.png" alt="Logo" className="h-10" />
            <span className="text-2xl font-bold text-sky-500">KonnYoeung</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className={inputStyle}
              required
            />

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputStyle}
              required
            />

            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className={inputStyle}
              required
            />

            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={`${inputStyle} ${error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-start justify-center pt-15">
        <img
          src={signupImage}
          alt="Signup"
          className="w-4/5 max-w-2xl object-contain"
        />
      </div>
    </div>
  );
}