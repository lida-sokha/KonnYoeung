import { EyeOff } from "lucide-react";
import signupImage from "../../assets/images/Login.png"; // reuse same image

export default function SignUp() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center"
      style={{ backgroundImage: `url(${signupImage})` }}
    >
      {/* FORM CONTAINER (50%) */}
      <div className="w-1/2 h-full bg-white flex flex-col justify-center px-24 shadow-xl">
        
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <img src="/logo.svg" alt="KonnYoeung" className="h-10" />
          <span className="text-xl font-semibold text-sky-500">
            KonnYoeung
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-10">Sign Up</h1>

        {/* Full Name */}
        <label className="text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          className="mb-5 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        {/* Email */}
        <label className="text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          className="mb-5 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        {/* Password */}
        <label className="text-sm font-medium mb-2">Password</label>
        <div className="relative mb-5">
          <input
            type="password"
            className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" />
        </div>

        {/* Confirm Password */}
        <label className="text-sm font-medium mb-2">Confirm Password</label>
        <div className="relative mb-8">
          <input
            type="password"
            className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" />
        </div>

        {/* Sign Up Button */}
        <button className="mb-6 w-full rounded-md bg-sky-500 py-3 text-white font-semibold hover:bg-sky-600 transition">
          Create Account
        </button>

        <div className="text-center text-gray-400 mb-6">or</div>

        {/* Social */}
        <button className="mb-3 w-full flex items-center justify-center gap-3 rounded-md border py-3 hover:bg-gray-50">
          <img src="/google.svg" className="h-5" />
          Continue with Google
        </button>

        <button className="w-full flex items-center justify-center gap-3 rounded-md border py-3 hover:bg-gray-50">
          <img src="/facebook.svg" className="h-5" />
          Continue with Facebook
        </button>

        {/* Login link */}
        <p className="mt-8 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-sky-500 font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
