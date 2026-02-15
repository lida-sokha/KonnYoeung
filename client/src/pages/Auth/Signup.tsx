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
  const inputStyle = `w-full rounded-xl border border-gray-200 px-5 py-4 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all`;

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-50">
      {/* LEFT SIDE – FORM */}
      <div className="w-full lg:w-1/2 flex items-start justify-center px-6 lg:pt-10 pt-16 px-6">
        <div className="w-full max-w-xl bg-white p-8 lg:p-10 rounded-3xl shadow-2xl shadown-grey-200/50">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Link to="/" className="flex item-center gap-3">
            <img src="/images/logo1.png" alt="Logo" className="h-10" />
              <span className="text-2xl font-bold text-sky-500">KonnYoeung</span>
            </Link>
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

          <div className="relative my-8 text-center">
            <hr className="border-gray-100" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-400 text-sm">or</span>
          </div>

          <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 hover:bg-gray-50 font-medium transition-colors">
            <img src="/images/google_logo.png" className="h-5" alt="Google" />
            Continue with Google
          </button>

          <p className="text-sm text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-start justify-center pt-10">
        <img
          src={signupImage}
          alt="Signup"
          className="w-4/5 max-w-2xl object-contain"
        />
      </div>
    </div>
  );
}