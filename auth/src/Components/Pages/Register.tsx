import { useState } from "react";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserTag } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../api/auth.api";
import type { RegisterErrors } from "../../api/types";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: RegisterErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid format";
    if (!formData.password) newErrors.password = "Required";
    else if (formData.password.length < 6) newErrors.password = "Min 6 chars";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mismatch";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await registerApi({ ...formData });
      navigate("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center py-12 px-4 selection:bg-cyan-500/30">
      <div className="bg-[var(--bg-secondary)] backdrop-blur-2xl border border-zinc-800 rounded-[2.5rem] w-full max-w-xl p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">Create Account</h2>
          <p className="text-zinc-500 font-medium">Join our premium e-commerce experience</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">First Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-4 bg-[var(--input-bg)] border rounded-2xl text-[var(--text-primary)] placeholder-zinc-600 focus:outline-none transition-all ${
                    errors.firstName ? "border-red-500/50" : "border-zinc-700/50 focus:border-cyan-500/50"
                  }`}
                  placeholder=""
                />
              </div>
              {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Last Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-4 bg-[var(--input-bg)] border rounded-2xl text-[var(--text-primary)] placeholder-zinc-600 focus:outline-none transition-all ${
                    errors.lastName ? "border-red-500/50" : "border-zinc-700/50 focus:border-cyan-500/50"
                  }`}
                  placeholder=""
                />
              </div>
              {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-400 ml-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-4 bg-[var(--input-bg)] border rounded-2xl text-[var(--text-primary)] placeholder-zinc-600 focus:outline-none transition-all ${
                  errors.email ? "border-red-500/50" : "border-zinc-700/50 focus:border-cyan-500/50"
                }`}
                placeholder=""
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-400 ml-1">Account Role</label>
            <div className="relative">
              <FaUserTag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-4 bg-[var(--input-bg)] border border-zinc-700/50 rounded-2xl text-[var(--text-primary)] appearance-none focus:outline-none focus:border-cyan-500/50 transition-all"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-4 bg-[var(--input-bg)] border rounded-2xl text-[var(--text-primary)] placeholder-zinc-600 focus:outline-none transition-all ${
                    errors.password ? "border-red-500/50" : "border-zinc-700/50 focus:border-cyan-500/50"
                  }`}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Confirm</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-4 bg-[var(--input-bg)] border rounded-2xl text-[var(--text-primary)] placeholder-zinc-600 focus:outline-none transition-all ${
                    errors.confirmPassword ? "border-red-500/50" : "border-zinc-700/50 focus:border-cyan-500/50"
                  }`}
                  placeholder=""
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-zinc-800 text-center">
          <p className="text-zinc-500 text-sm font-medium">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-cyan-500 hover:text-cyan-400 font-bold ml-1">
              Sign in here
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
};

export default Register;
