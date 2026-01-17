import { EyeOff } from "lucide-react";
import loginImage from "../../assets/images/Login.png";

export default function Login() {
  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden">
      {/* Main container */}
      <div
        className="w-[1512px] h-[982px] flex rounded-2xl overflow-hidden shadow-lg"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* LEFT SIDE – FORM (40%) */}
        <div className="w-2/5 px-24 py-20 flex flex-col justify-center bg-white">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <img src="/logo.svg" alt="KonnYoeung" className="h-10" />
            <span className="text-xl font-semibold text-sky-500">
              KonnYoeung
            </span>
          </div>

          <h1 className="text-3xl font-bold mb-10">Login</h1>

          {/* Username */}
          <label className="text-sm font-medium mb-2">
            Username or email
          </label>
          <input
            type="text"
            className="mb-6 w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />

          {/* Password */}
          <label className="text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative mb-3">
            <input
              type="password"
              className="w-full rounded-md border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <EyeOff className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" />
          </div>

          {/* Forgot password */}
          <div className="mb-8 text-sm">
            <span className="text-gray-500">Forgot password? </span>
            <a href="#" className="text-sky-500 font-medium">
              Reset your password
            </a>
          </div>

          {/* Login button */}
          <button className="mb-6 w-full rounded-md bg-sky-500 py-3 text-white font-semibold hover:bg-sky-600 transition">
            Login
          </button>

          <div className="text-center text-gray-400 mb-6">or</div>

          {/* Social buttons */}
          <button className="mb-3 w-full flex items-center justify-center gap-3 rounded-md border py-3 hover:bg-gray-50">
            <img src="/google.svg" className="h-5" />
            Continue with Google
          </button>

          <button className="mb-3 w-full flex items-center justify-center gap-3 rounded-md bg-gray-200 py-3 hover:bg-gray-300">
            <img src="/microsoft.svg" className="h-5" />
            Continue with Microsoft
          </button>

          <button className="w-full flex items-center justify-center gap-3 rounded-md border py-3 hover:bg-gray-50">
            <img src="/facebook.svg" className="h-5" />
            Continue with Facebook
          </button>

          {/* Sign up */}
          <p className="mt-8 text-sm text-center">
            Don’t have account?{" "}
            <a href="#" className="text-sky-500 font-medium">
              Sign Up
            </a>
          </p>
        </div>

        {/* RIGHT SIDE – EMPTY (shows background image) */}
        <div className="w-3/5" />
      </div>
    </div>
  );
}
