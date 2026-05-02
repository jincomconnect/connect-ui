import { Link } from "react-router";
import { motion } from "motion/react";
import { Users, Star, TrendingUp, Clock, Shield } from "lucide-react";
import "./Communities.css";

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  joined: string;
  isAdmin: boolean;
}

// Mock data - replace with real data from Supabase
const mockCommunities: Community[] = [
  {
    id: "1",
    name: "Local Designers",
    description: "Creative professionals sharing design services and collaborating on projects",
    members: 1247,
    posts: 3891,
    category: "Design",
    joined: "3 months ago",
    isAdmin: true
  },
  {
    id: "2",
    name: "Tech Freelancers",
    description: "Software developers and tech consultants offering their expertise",
    members: 2103,
    posts: 5672,
    category: "Technology",
    joined: "6 months ago",
    isAdmin: false
  },
  {
    id: "3",
    name: "Marketing Pros",
    description: "Marketing specialists and growth hackers helping businesses scale",
    members: 892,
    posts: 2341,
    category: "Marketing",
    joined: "2 months ago",
    isAdmin: true
  },
  {
    id: "4",
    name: "Photography Community",
    description: "Photographers showcasing their work and offering professional services",
    members: 1534,
    posts: 4219,
    category: "Creative",
    joined: "4 months ago",
    isAdmin: false
  },
  {
    id: "5",
    name: "Wellness Network",
    description: "Health and wellness professionals providing coaching and training services",
    members: 678,
    posts: 1823,
    category: "Health",
    joined: "1 month ago",
    isAdmin: false
  }
];

export function Communities() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Communities</h1>
          <p className="text-neutral-600">Communities you're part of</p>
        </motion.div>

        {/* Communities Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {mockCommunities.map((community, index) => (
            <motion.div
              key={community.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Community Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={24} />
                    {community.isAdmin && (
                      <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                        <svg viewBox="0 0 512 462.24" width="11" height="11" fill="white" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                          <path d="M211.02 0C132.6 49.71 61.75 73.23.95 67.67-9.67 282.45 69.65 409.3 210.21 462.24c15.15-5.53 29.6-11.96 43.31-19.32a36.277 36.277 0 0 1-12.56-8.15l-.06-.07-.06.07c-3-3-5.48-6.53-7.27-10.43-7.56 3.5-15.34 6.72-23.35 9.64C86.85 387.52 17.23 276.18 26.54 87.65c53.37 4.88 115.56-15.76 184.4-59.4 59.56 46.27 121.03 59.82 183.68 56.54.52 19.96.27 38.97-.7 57.09 8.27 1.21 16.35 4 24.15 8.57 2.25-26.82 3.03-55.47 2.22-86.04C348.92 68.15 278.88 52.71 211.02 0zm55.15 413.12a3.67 3.67 0 0 1-3.68-3.68c0-1.05.15-2.08.39-3.11 5.91-46.78 26.59-47.62 52.6-54.39 7.75-2.02 21.94-3.1 30.2-10.33 4.55-4 7.3-12.13 6.2-18-6.27-5.83-11.11-12.13-12.21-24.14l-.75.01c-1.75-.03-3.44-.41-5-1.31-3.47-1.99-5.37-5.74-6.29-10.07-1.16-5.45-.77-11.93-.2-16.01l.2-.81c1.21-3.37 2.71-5.2 4.62-5.99l.05-.03c-.87-16.23 1.87-41.94-14.79-47 32.91-40.68 70.87-62.82 99.37-26.62 31.75 1.67 45.91 48.47 26.19 73.65h-.83c1.89.79 3.39 2.62 4.6 5.99l.22.81c.57 4.08.95 10.56-.22 16.01-.92 4.33-2.81 8.08-6.28 10.07-1.56.9-3.25 1.28-4.99 1.31l-.76-.01c-1.09 12.01-5.93 18.31-12.2 24.14-1.12 5.87 1.65 14 6.19 18 8.27 7.23 22.45 8.3 30.22 10.33 26 6.77 46.68 7.61 52.59 54.39.24 1.03.39 2.06.39 3.11 0 2.04-1.65 3.68-3.68 3.68H266.17zM208.74 74.84c-53.04 33.61-100.95 49.51-142.06 45.76-7.18 145.23 46.45 231 141.5 266.8.6-.22 1.19-.45 1.79-.67V75.78l-1.23-.94z"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">{community.name}</h2>
                    <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full mt-1">
                      {community.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-600 mb-4">{community.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-neutral-900 font-bold mb-1">
                    <Users size={16} />
                    {community.members.toLocaleString()}
                  </div>
                  <p className="text-xs text-neutral-500">Members</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-neutral-900 font-bold mb-1">
                    <TrendingUp size={16} />
                    {community.posts.toLocaleString()}
                  </div>
                  <p className="text-xs text-neutral-500">Posts</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-neutral-900 font-bold mb-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    Active
                  </div>
                  <p className="text-xs text-neutral-500">Status</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-1 text-neutral-500 text-sm">
                  <Clock size={14} />
                  Joined {community.joined}
                </div>
                <Link
                  to={`/community/${community.id}`}
                  className="px-4 py-2 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  View Posts
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
