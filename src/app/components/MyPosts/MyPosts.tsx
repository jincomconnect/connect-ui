import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Pencil, Trash2, TrendingUp, MapPin, Users, Search, Clock, CheckCircle, XCircle, Plus } from "lucide-react";
import { CreatePostModal, EditInitialData } from "../CreatePost/CreatePost";

const CURRENT_USER = "John Doe";

interface MyPost {
  id: string;
  service: string;
  description: string;
  category: string;
  type: "offering" | "seeking";
  community: string;
  communityId: string;
  communityLogo: string;
  location: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  likes: number;
  comments: number;
}

const mockMyPosts: MyPost[] = [
  {
    id: "101",
    service: "Brand Identity & Logo Design",
    description: "Full brand identity packages for startups — logo, color palette, typography and usage guide. Turnaround in 5-7 days.",
    category: "Design",
    type: "offering",
    community: "Local Designers",
    communityId: "1",
    communityLogo: "from-purple-500 to-pink-500",
    location: "San Francisco, CA",
    status: "approved",
    timestamp: "3 days ago",
    likes: 47,
    comments: 9,
  },
  {
    id: "102",
    service: "UI Audit for Mobile App",
    description: "Looking for someone to review and improve the UX/UI of my mobile app prototype. Budget is negotiable.",
    category: "Technology",
    type: "seeking",
    community: "Tech Freelancers",
    communityId: "2",
    communityLogo: "from-blue-500 to-cyan-500",
    location: "San Francisco, CA",
    status: "pending",
    timestamp: "1 day ago",
    likes: 12,
    comments: 3,
  },
  {
    id: "103",
    service: "Custom Icon Set Design",
    description: "Designing clean, consistent icon libraries for SaaS products and design systems. Delivered in SVG & Figma.",
    category: "Design",
    type: "offering",
    community: "Local Designers",
    communityId: "1",
    communityLogo: "from-purple-500 to-pink-500",
    location: "Remote",
    status: "rejected",
    timestamp: "1 week ago",
    likes: 5,
    comments: 1,
  },
];

const statusConfig = {
  approved: { label: "Approved",      Icon: CheckCircle, className: "bg-green-100 text-green-700" },
  pending:  { label: "Pending Review", Icon: Clock,        className: "bg-amber-100 text-amber-700" },
  rejected: { label: "Rejected",      Icon: XCircle,      className: "bg-red-100 text-red-700"   },
};

export function MyPosts() {
  const [posts, setPosts] = useState<MyPost[]>(mockMyPosts);
  const [editTarget, setEditTarget] = useState<MyPost | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (post: MyPost) => {
    setEditTarget(post);
    setIsEditOpen(true);
  };

  const handleDeleteExecute = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  };

  const getEditData = (post: MyPost): EditInitialData => ({
    postType: post.type,
    communityIds: [post.communityId],
    location: post.location === "Remote" ? "" : post.location,
    isInPerson: post.location !== "Remote",
    isOnline: post.location === "Remote",
    serviceTitle: post.service,
    category: post.category,
    description: post.description,
    price: "",
    priceType: "",
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">My Posts</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {posts.length} post{posts.length !== 1 ? "s" : ""} · {CURRENT_USER}
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} />
            New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={28} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">No posts yet</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Share your services or seek help from your communities.
            </p>
            <Link
              to="/"
              className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              Create your first post
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {posts.map((post, index) => {
                const { label, Icon: StatusIcon, className: statusClass } = statusConfig[post.status];
                const isDeleting = deletingId === post.id;

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${post.communityLogo} flex items-center justify-center`}>
                            <Users size={12} className="text-white" />
                          </div>
                          <span className="text-sm text-neutral-600 font-medium">{post.community}</span>
                          <span className="text-neutral-300">·</span>
                          <span className="text-xs text-neutral-400">{post.timestamp}</span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                            <StatusIcon size={11} />
                            {label}
                          </span>

                          {isDeleting ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteExecute(post.id)}
                                className="px-2.5 py-1 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-lg hover:bg-neutral-200 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEdit(post)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors"
                                aria-label="Edit post"
                              >
                                <Pencil size={15} />
                              </button>
                              <button
                                onClick={() => setDeletingId(post.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                                aria-label="Delete post"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Type + category chips */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                          post.type === "offering" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {post.type === "offering" ? "Offering" : "Seeking"}
                        </span>
                        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-md">
                          {post.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-base font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
                        {post.type === "offering"
                          ? <TrendingUp size={15} className="text-neutral-600" />
                          : <Search size={15} className="text-neutral-600" />}
                        {post.service}
                      </h2>

                      {/* Description */}
                      <p className="text-sm text-neutral-600 line-clamp-2">{post.description}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <MapPin size={11} />
                          {post.location}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-neutral-400">
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {editTarget && (
        <CreatePostModal
          isOpen={isEditOpen}
          onClose={() => { setIsEditOpen(false); setEditTarget(null); }}
          editPost={getEditData(editTarget)}
        />
      )}
    </div>
  );
}
