import { useState } from "react";
import { motion } from "motion/react";
import { Check, X, MessageSquare, AlertCircle, Clock } from "lucide-react";
import "./AdminPanel.css";

interface PendingPost {
  id: string;
  author: string;
  community: string;
  communityLogo: string;
  service: string;
  description: string;
  location: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

// Mock data - replace with real data from Supabase
const mockPendingPosts: PendingPost[] = [
  {
    id: "p1",
    author: "Alex Martinez",
    community: "Local Designers",
    communityLogo: "from-purple-500 to-purple-600",
    service: "UI/UX Design Services",
    description: "Offering comprehensive UI/UX design for mobile and web applications. Portfolio available upon request.",
    location: "Portland, OR",
    submittedAt: "30 minutes ago",
    status: "pending"
  },
  {
    id: "p2",
    author: "Rachel Kim",
    community: "Marketing Pros",
    communityLogo: "from-pink-500 to-pink-600",
    service: "Email Marketing Campaigns",
    description: "Creating high-converting email campaigns with proven track record. Mailchimp and HubSpot certified.",
    location: "Boston, MA",
    submittedAt: "1 hour ago",
    status: "pending"
  },
  {
    id: "p3",
    author: "James Wilson",
    community: "Tech Freelancers",
    communityLogo: "from-blue-500 to-blue-600",
    service: "Mobile App Development",
    description: "Native iOS and Android development. React Native specialist. Let's build your app idea!",
    location: "Chicago, IL",
    submittedAt: "2 hours ago",
    status: "pending"
  },
  {
    id: "p4",
    author: "Maria Garcia",
    community: "Wellness Network",
    communityLogo: "from-green-500 to-green-600",
    service: "Yoga & Meditation Classes",
    description: "Virtual and in-person yoga sessions for all levels. Certified instructor with 8 years experience.",
    location: "Los Angeles, CA",
    submittedAt: "3 hours ago",
    status: "pending"
  }
];

export function AdminPanel() {
  const [posts, setPosts] = useState<PendingPost[]>(mockPendingPosts);
  const [selectedPost, setSelectedPost] = useState<PendingPost | null>(null);
  const [feedback, setFeedback] = useState("");

  const handleApprove = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, status: "approved" as const } : p));
    setSelectedPost(null);
    setFeedback("");
  };

  const handleReject = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, status: "rejected" as const } : p));
    setSelectedPost(null);
    setFeedback("");
  };

  const handleSuggestUpdate = (postId: string) => {
    if (feedback.trim()) {
      alert(`Feedback sent to author: ${feedback}`);
      setFeedback("");
      setSelectedPost(null);
    }
  };

  const pendingCount = posts.filter(p => p.status === "pending").length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Panel</h1>
              <p className="text-neutral-600">Review and moderate community posts</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-lg">
              <AlertCircle size={20} />
              <span className="font-medium">{pendingCount} pending review</span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Clock className="text-amber-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{pendingCount}</p>
                <p className="text-sm text-neutral-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Check className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {posts.filter(p => p.status === "approved").length}
                </p>
                <p className="text-sm text-neutral-600">Approved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <X className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">
                  {posts.filter(p => p.status === "rejected").length}
                </p>
                <p className="text-sm text-neutral-600">Rejected</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl border-2 transition-all ${
                selectedPost?.id === post.id
                  ? "border-neutral-900"
                  : post.status === "approved"
                  ? "border-green-200"
                  : post.status === "rejected"
                  ? "border-red-200"
                  : "border-neutral-200"
              }`}
            >
              <div className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white font-medium">
                      {post.author.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">{post.author}</h3>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${post.communityLogo} flex items-center justify-center text-white text-[8px] font-medium`}>
                            {post.community.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span>{post.community}</span>
                        </div>
                        <span>•</span>
                        <span>{post.submittedAt}</span>
                      </div>
                    </div>
                  </div>
                  {post.status !== "pending" && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        post.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {post.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  )}
                </div>

                {/* Post Content */}
                <h2 className="text-xl font-bold text-neutral-900 mb-2">{post.service}</h2>
                <p className="text-neutral-700 mb-3">{post.description}</p>
                <p className="text-sm text-neutral-500 mb-4">📍 {post.location}</p>

                {/* Actions */}
                {post.status === "pending" && (
                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X size={18} />
                      Reject
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
                    >
                      <MessageSquare size={18} />
                      Suggest Update
                    </button>
                  </div>
                )}

                {/* Feedback Form */}
                {selectedPost?.id === post.id && post.status === "pending" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-neutral-200"
                  >
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Feedback for author
                    </label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent mb-3"
                      rows={3}
                      placeholder="Suggest improvements or changes..."
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSuggestUpdate(post.id)}
                        className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        Send Feedback
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPost(null);
                          setFeedback("");
                        }}
                        className="px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
