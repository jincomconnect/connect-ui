import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, Eye, EyeOff, KeyRound, User, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

type Mode = "member" | "admin";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>("member");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "admin") {
      if (adminKey !== "admin123") {
        setError("Invalid admin access key. Try: admin123");
        return;
      }
      login("admin");
      navigate("/admin");
    } else {
      login("member");
      navigate("/");
    }
  };

  const isAdmin = mode === "admin";

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 transition-colors duration-300 ${isAdmin ? "bg-neutral-900" : "bg-neutral-100"}`}>
            {isAdmin
              ? <Shield className="text-white" size={26} />
              : <User className="text-neutral-700" size={26} />
            }
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">
            {isAdmin ? "Admin sign in" : "Welcome back"}
          </h1>
          <p className="text-neutral-500 text-sm">
            {isAdmin ? "Access the community management panel" : "Sign in to access your communities"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="flex border-b border-neutral-100">
            <button
              type="button"
              onClick={() => { setMode("member"); setError(""); }}
              className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                mode === "member"
                  ? "text-neutral-900 border-b-2 border-neutral-900 -mb-px"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => { setMode("admin"); setError(""); }}
              className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
                mode === "admin"
                  ? "text-neutral-900 border-b-2 border-neutral-900 -mb-px"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Admin
            </button>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: mode === "admin" ? 16 : -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "admin" ? -16 : 16 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-neutral-700">Password</label>
                    <button type="button" className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full pl-9 pr-10 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Admin access key</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        type={showKey ? "text" : "password"}
                        value={adminKey}
                        onChange={(e) => { setAdminKey(e.target.value); setError(""); }}
                        autoComplete="off"
                        className="w-full pl-9 pr-10 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                        placeholder="Enter your admin key"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-400">
                      Hint: use <span className="font-mono text-neutral-600">admin123</span> for demo access.
                    </p>
                  </div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
                >
                  {isAdmin ? "Sign in as Admin" : "Sign in"}
                </button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                Don't have an account?{" "}
                <Link
                  to={isAdmin ? "/signup?role=admin" : "/signup"}
                  className="text-neutral-900 font-medium hover:underline"
                >
                  {isAdmin ? "Request admin access" : "Sign up"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
