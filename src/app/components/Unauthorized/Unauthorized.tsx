import { Link } from "react-router";
import { motion } from "motion/react";
import { ShieldOff } from "lucide-react";

export function Unauthorized() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-sm"
      >
        <div className="inline-flex w-16 h-16 rounded-2xl bg-red-50 items-center justify-center mb-6">
          <ShieldOff size={30} className="text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Access denied</h1>
        <p className="text-neutral-500 text-sm mb-8">
          You need admin privileges to view this page. Please sign in with an admin account.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Go home
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Sign in as Admin
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
