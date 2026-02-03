import loginImage from "../../../public/images/Login.png";

export default function Login() {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">

      <div className="w-full lg:w-1/2 h-full p-12 lg:p-24 flex flex-col justify-center bg-white">

        <div className="flex items-center gap-3 mb-10 pt-10">
          <img src="/images/logo1.png" alt="KonnYoeung" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-sky-500 tracking-tight">
            KonnYoeung
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-left">Login</h1>

        <div className="space-y-5 max-w-md">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username or email
            </label>
            <input
              type="text"
              placeholder="Enter your username or email"
              className="w-full rounded-xl border border-gray-200 px-4 py-4 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <span className="text-gray-500">Forgot password? </span>
          <a href="#" className="text-sky-500 font-semibold hover:underline">
            Reset your password
          </a>
        </div>

        <div className="max-w-md">
          <button className="mt-10 w-full rounded-xl bg-sky-500 py-4 text-white font-bold text-lg hover:bg-sky-600 transition-all active:scale-[0.98]">
            Login
          </button>
        </div>

        <div className="relative my-8 text-center max-w-md">
          <hr className="border-gray-100" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-400 text-sm">or</span>
        </div>

        <div className="space-y-3 max-w-md">
          <button className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 hover:bg-gray-50 font-medium">
            <img src="/images/google_logo.png" className="h-5" alt="Google" />
            Continue with Google
          </button>

        </div>

        <p className="mt-10 text-sm text-center max-w-md text-gray-600">
          Don’t have account?{" "}
          <a href="/signup" className="text-sky-500 font-bold hover:underline">
            Sign Up
          </a>
        </p>
      </div>

      {/* RIGHT SIDE – IMAGE (Exactly 50%) */}
      <div
        className="hidden lg:block lg:w-1/2 h-full"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat"
        }}
      />
    </div>
  );
}