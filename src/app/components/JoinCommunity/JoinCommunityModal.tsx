import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Users, Check, UserPlus } from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  color: string;
  joined: boolean;
}

const allCommunities: Community[] = [
  {
    id: "1",
    name: "Local Designers",
    description: "Creative professionals sharing design services and collaborating on projects.",
    category: "Design",
    members: 1247,
    color: "from-purple-500 to-pink-500",
    joined: true,
  },
  {
    id: "2",
    name: "Tech Freelancers",
    description: "Software developers and tech consultants offering their expertise.",
    category: "Technology",
    members: 2103,
    color: "from-blue-500 to-cyan-500",
    joined: true,
  },
  {
    id: "3",
    name: "Marketing Pros",
    description: "Marketing specialists and growth hackers helping businesses scale.",
    category: "Marketing",
    members: 892,
    color: "from-green-500 to-emerald-500",
    joined: true,
  },
  {
    id: "4",
    name: "Photography Community",
    description: "Photographers showcasing their work and offering professional services.",
    category: "Creative",
    members: 1534,
    color: "from-orange-500 to-red-500",
    joined: true,
  },
  {
    id: "5",
    name: "Wellness Network",
    description: "Health and wellness professionals providing coaching and training services.",
    category: "Health",
    members: 678,
    color: "from-teal-500 to-green-500",
    joined: true,
  },
  {
    id: "6",
    name: "Writers Guild",
    description: "Writers, editors, and content creators collaborating on projects.",
    category: "Creative",
    members: 541,
    color: "from-yellow-500 to-orange-500",
    joined: false,
  },
  {
    id: "7",
    name: "Startup Founders",
    description: "Entrepreneurs sharing resources, co-founders, and growth strategies.",
    category: "Entrepreneurship",
    members: 1890,
    color: "from-indigo-500 to-purple-500",
    joined: false,
  },
  {
    id: "8",
    name: "Music Makers",
    description: "Musicians, producers, and audio engineers finding collaborators.",
    category: "Music",
    members: 723,
    color: "from-rose-500 to-pink-500",
    joined: false,
  },
  {
    id: "9",
    name: "Finance Hub",
    description: "Financial advisors, accountants, and investment professionals.",
    category: "Finance",
    members: 1102,
    color: "from-emerald-500 to-teal-500",
    joined: false,
  },
  {
    id: "10",
    name: "Legal Pros Network",
    description: "Attorneys and legal consultants offering professional services.",
    category: "Legal",
    members: 387,
    color: "from-slate-600 to-slate-800",
    joined: false,
  },
  {
    id: "11",
    name: "Real Estate Circle",
    description: "Agents, investors, and property managers sharing opportunities.",
    category: "Real Estate",
    members: 964,
    color: "from-amber-500 to-yellow-500",
    joined: false,
  },
  {
    id: "12",
    name: "Food & Culinary Arts",
    description: "Chefs, caterers, and food entrepreneurs connecting locally.",
    category: "Food",
    members: 612,
    color: "from-red-500 to-orange-500",
    joined: false,
  },
  {
    id: "13",
    name: "Educators Network",
    description: "Teachers, tutors, and coaches offering learning services.",
    category: "Education",
    members: 845,
    color: "from-sky-500 to-blue-500",
    joined: false,
  },
  {
    id: "14",
    name: "Gaming Community",
    description: "Game developers, streamers, and content creators leveling up together.",
    category: "Gaming",
    members: 2341,
    color: "from-violet-500 to-fuchsia-500",
    joined: false,
  },
  {
    id: "15",
    name: "Green Builders",
    description: "Sustainable architects, contractors, and eco-conscious tradespeople.",
    category: "Construction",
    members: 299,
    color: "from-lime-500 to-green-600",
    joined: false,
  },
];

const categories = ["All", ...Array.from(new Set(allCommunities.map(c => c.category))).sort()];

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinCommunityModal({ isOpen, onClose }: JoinCommunityModalProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [joinedIds, setJoinedIds] = useState<Set<string>>(
    () => new Set(allCommunities.filter(c => c.joined).map(c => c.id))
  );
  const [justJoined, setJustJoined] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveCategory("All");
      setJustJoined(new Set());
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleJoin = (id: string) => {
    setJoinedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        setJustJoined(prev2 => new Set(prev2).add(id));
      }
      return next;
    });
  };

  const filtered = allCommunities.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "All" || c.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  const newlyJoinedCount = justJoined.size;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                  <UserPlus size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900 leading-tight">Join a Community</h2>
                  {newlyJoinedCount > 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      {newlyJoinedCount} new communit{newlyJoinedCount === 1 ? "y" : "ies"} joined this session
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X size={18} className="text-neutral-600" />
              </button>
            </div>

            {/* Search + Category filters */}
            <div className="px-6 pt-4 pb-3 border-b border-neutral-100 flex-shrink-0 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search communities…"
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent focus:bg-white transition-colors"
                />
              </div>

              {/* Category chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      activeCategory === cat
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Community list */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-3">
                    <Users size={22} className="text-neutral-400" />
                  </div>
                  <p className="font-medium text-neutral-700 mb-1">No communities found</p>
                  <p className="text-sm text-neutral-400">Try a different search or category</p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {filtered.map(community => {
                    const isJoined = joinedIds.has(community.id);
                    const wasJustJoined = justJoined.has(community.id);
                    return (
                      <motion.div
                        key={community.id}
                        layout
                        className="flex items-center gap-4 p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/50 transition-all"
                      >
                        {/* Gradient icon */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${community.color} flex items-center justify-center flex-shrink-0`}>
                          <Users size={20} className="text-white" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-neutral-900 text-sm truncate">{community.name}</h3>
                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-xs rounded-full flex-shrink-0">
                              {community.category}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-1">{community.description}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-neutral-400">
                            <Users size={11} />
                            {community.members.toLocaleString()} members
                          </div>
                        </div>

                        {/* Join button */}
                        <AnimatePresence mode="wait">
                          {isJoined ? (
                            <motion.button
                              key="joined"
                              initial={{ scale: 0.85, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.85, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              onClick={() => !wasJustJoined ? null : handleJoin(community.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-colors ${
                                wasJustJoined
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-neutral-100 text-neutral-500 cursor-default"
                              }`}
                            >
                              <Check size={13} />
                              {wasJustJoined ? "Joined!" : "Member"}
                            </motion.button>
                          ) : (
                            <motion.button
                              key="join"
                              initial={{ scale: 0.85, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.85, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              onClick={() => handleJoin(community.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-700 transition-colors flex-shrink-0"
                            >
                              <UserPlus size={13} />
                              Join
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0 flex items-center justify-between">
              <p className="text-xs text-neutral-400">
                {filtered.length} communit{filtered.length !== 1 ? "ies" : "y"} · {joinedIds.size} joined
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
