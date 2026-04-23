import { useState } from "react";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { loginApi } from "../../api/auth.api";
import { decodeToken } from "../../utils/jwt";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  try {
    const result = await loginApi({ email, password });


    localStorage.setItem("token", result.token);


    const decoded = decodeToken(result.token);
    console.log("Decoded JWT:", decoded);
    


    localStorage.setItem("user", JSON.stringify({
      role:      decoded.role,
      email:     decoded.email,
      firstName: decoded.firstName,
      lastName:  decoded.lastName,
      fullName:  decoded.fullName,
      userId:    decoded.userId,
    }));


    setTimeout(() => {
      if (decoded.role === "Admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/user/dashboard";
      }
    }, 500);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 selection:bg-cyan-500/30">
      <div className="bg-[var(--bg-secondary)] backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-zinc-500 font-medium">Please enter your details to sign in</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-400 ml-1">Email Address</label>
            <div className="relative group/field">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within/field:text-cyan-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-11 pr-4 py-4 bg-[var(--input-bg)] border rounded-2xl text-[var(--text-primary)] placeholder-zinc-600 focus:outline-none transition-all ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-zinc-700/50 focus:border-cyan-500/50"
                }`}
                placeholder=""
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-zinc-400">Password</label>
              <Link to="#" className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors">
                
              </Link>
            </div>
            <div className="relative group/field">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 transition-colors group-focus-within/field:text-cyan-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-11 pr-12 py-4 bg-[var(--input-bg)] border rounded-2xl text-[var(--text-primary)] placeholder-zinc-600 focus:outline-none transition-all ${
                  errors.password
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-zinc-700/50 focus:border-cyan-500/50"
                }`}
                placeholder=""
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-cyan-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </span>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm font-medium">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors ml-1">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;