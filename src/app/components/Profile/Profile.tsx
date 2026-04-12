import { motion } from "motion/react";
import { User, Mail, MapPin, Calendar, Edit } from "lucide-react";
import "./Profile.css";

// Mock user data - replace with real data from Supabase
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  location: "San Francisco, CA",
  joinedDate: "January 2026",
  bio: "Passionate about connecting communities and sharing knowledge",
  phone: "+1 (555) 123-4567",
  website: "johndoe.com"
};

export function Profile() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Profile</h1>
          <p className="text-neutral-600">Manage your personal information</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-neutral-200 p-8"
        >
          {/* Avatar and Basic Info */}
          <div className="flex items-start gap-6 mb-8 pb-8 border-b border-neutral-200">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white text-3xl font-bold">
              {mockUser.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">{mockUser.name}</h2>
              <p className="text-neutral-600 mb-4">{mockUser.bio}</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors">
                <Edit size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-lg">
                <Mail size={18} className="text-neutral-400" />
                <span className="text-neutral-900">{mockUser.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-lg">
                <User size={18} className="text-neutral-400" />
                <span className="text-neutral-900">{mockUser.phone}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Location</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-lg">
                <MapPin size={18} className="text-neutral-400" />
                <span className="text-neutral-900">{mockUser.location}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Member Since</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-lg">
                <Calendar size={18} className="text-neutral-400" />
                <span className="text-neutral-900">{mockUser.joinedDate}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
