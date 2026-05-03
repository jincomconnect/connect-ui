import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, KeyRound, Building2, Shield } from "lucide-react";
import "./Signup.css";

type Mode = "member" | "admin";

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode: Mode = searchParams.get("role") === "admin" ? "admin" : "member";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const isAdmin = mode === "admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);
    navigate(isAdmin ? "/admin" : "/");
  };

  const inputClass = "w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all";

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className={`inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-4 transition-colors duration-300 ${isAdmin ? "bg-neutral-900" : "bg-neutral-100"}`}>
            {isAdmin
              ? <Shield className="text-white" size={26} />
              : <User className="text-neutral-700" size={26} />
            }
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">
            {isAdmin ? "Request admin access" : "Create your account"}
          </h1>
          <p className="text-neutral-500 text-sm">
            {isAdmin ? "Submit your details for admin approval" : "Join CommunityHub and connect with others"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Mode toggle */}
          <div className="flex border-b border-neutral-100">
            <button
              type="button"
              onClick={() => setMode("member")}
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
              onClick={() => setMode("admin")}
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
                className="space-y-4"
              >
                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Organization — admin only */}
                {isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Organization</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        type="text"
                        value={org}
                        onChange={(e) => setOrg(e.target.value)}
                        className={inputClass}
                        placeholder="Your company or community name"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordMismatch(false); }}
                      className={inputClass + " pr-10"}
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

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordMismatch(false); }}
                      className={`${inputClass} pr-10 ${passwordMismatch ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <p className="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
                  )}
                </div>

                {/* Invite / access code — admin only */}
                {isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Invitation code</label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        type={showCode ? "text" : "password"}
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className={inputClass + " pr-10"}
                        placeholder="Enter your invitation code"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCode(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-400">
                      An invitation code is required to register as an admin.
                    </p>
                  </div>
                )}

                {/* Terms — member only */}
                {!isAdmin && (
                  <p className="text-xs text-neutral-400 pt-1">
                    By creating an account you agree to our{" "}
                    <span className="text-neutral-700 underline cursor-pointer">Terms of Service</span>{" "}
                    and{" "}
                    <span className="text-neutral-700 underline cursor-pointer">Privacy Policy</span>.
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-700 transition-colors mt-2"
                >
                  {isAdmin ? "Submit admin request" : "Create account"}
                </button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-500">
                Already have an account?{" "}
                <Link
                  to={isAdmin ? "/login?role=admin" : "/login"}
                  className="text-neutral-900 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
