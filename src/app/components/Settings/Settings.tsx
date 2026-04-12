import { motion } from "motion/react";
import { Bell, Lock, Globe, Moon, Eye } from "lucide-react";
import "./Settings.css";

export function Settings() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
          <p className="text-neutral-600">Manage your account preferences</p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Bell className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-neutral-900">Notifications</h2>
                <p className="text-sm text-neutral-600">Manage how you receive notifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Email notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Push notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Community activity alerts</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Lock className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-neutral-900">Privacy & Security</h2>
                <p className="text-sm text-neutral-600">Control your privacy settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Profile visibility</span>
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                  <option>Public</option>
                  <option>Community only</option>
                  <option>Private</option>
                </select>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Show online status</span>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Eye className="text-indigo-600" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-neutral-900">Appearance</h2>
                <p className="text-sm text-neutral-600">Customize how the app looks</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Theme</span>
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Compact mode</span>
                <input type="checkbox" className="w-5 h-5 rounded" />
              </label>
            </div>
          </motion.div>

          {/* Language & Region */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Globe className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="font-bold text-neutral-900">Language & Region</h2>
                <p className="text-sm text-neutral-600">Set your language and location preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Language</span>
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-neutral-700">Timezone</span>
                <select className="px-3 py-2 border border-neutral-300 rounded-lg text-sm">
                  <option>Pacific Time (PT)</option>
                  <option>Mountain Time (MT)</option>
                  <option>Central Time (CT)</option>
                  <option>Eastern Time (ET)</option>
                </select>
              </label>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
