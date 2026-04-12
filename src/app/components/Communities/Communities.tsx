import { motion } from "motion/react";
import { Users, Star, TrendingUp, Clock } from "lucide-react";
import "./Communities.css";

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  joined: string;
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
    joined: "3 months ago"
  },
  {
    id: "2",
    name: "Tech Freelancers",
    description: "Software developers and tech consultants offering their expertise",
    members: 2103,
    posts: 5672,
    category: "Technology",
    joined: "6 months ago"
  },
  {
    id: "3",
    name: "Marketing Pros",
    description: "Marketing specialists and growth hackers helping businesses scale",
    members: 892,
    posts: 2341,
    category: "Marketing",
    joined: "2 months ago"
  },
  {
    id: "4",
    name: "Photography Community",
    description: "Photographers showcasing their work and offering professional services",
    members: 1534,
    posts: 4219,
    category: "Creative",
    joined: "4 months ago"
  },
  {
    id: "5",
    name: "Wellness Network",
    description: "Health and wellness professionals providing coaching and training services",
    members: 678,
    posts: 1823,
    category: "Health",
    joined: "1 month ago"
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
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center">
                    <Users className="text-white" size={24} />
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
