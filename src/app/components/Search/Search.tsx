import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Share2, MapPin, TrendingUp, Search as SearchIcon, Filter, Users, Phone, MessageSquare, Send, KeyRound, Lock, Check, AlertCircle, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./Search.css";

interface SearchResult {
  id: string;
  author: string;
  community: string;
  communityLogo: string;
  service: string;
  description: string;
  location: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
}

// Mock search results - replace with real data from Supabase
const allServices: SearchResult[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    community: "Local Designers",
    communityLogo: "from-purple-500 to-purple-600",
    service: "Custom Logo Design",
    description: "Specializing in modern, minimalist logos for startups and small businesses. 10+ years experience. Let's bring your brand to life!",
    location: "San Francisco, CA",
    likes: 124,
    comments: 18,
    timestamp: "2 hours ago",
    category: "Design"
  },
  {
    id: "2",
    author: "Michael Chen",
    community: "Tech Freelancers",
    communityLogo: "from-blue-500 to-blue-600",
    service: "Full-Stack Development",
    description: "Building scalable web applications with React, Node.js, and cloud infrastructure. Available for project-based work.",
    location: "Austin, TX",
    likes: 89,
    comments: 12,
    timestamp: "5 hours ago",
    category: "Technology"
  },
  {
    id: "3",
    author: "Emily Rodriguez",
    community: "Marketing Pros",
    communityLogo: "from-pink-500 to-pink-600",
    service: "Social Media Management",
    description: "Grow your online presence with data-driven strategies. Instagram, TikTok, LinkedIn expertise. Free consultation!",
    location: "Miami, FL",
    likes: 156,
    comments: 24,
    timestamp: "8 hours ago",
    category: "Marketing"
  },
  {
    id: "4",
    author: "David Park",
    community: "Photography Community",
    communityLogo: "from-orange-500 to-orange-600",
    service: "Event Photography",
    description: "Capturing your special moments with artistic vision. Weddings, corporate events, portraits. Check out my portfolio!",
    location: "Seattle, WA",
    likes: 203,
    comments: 31,
    timestamp: "1 day ago",
    category: "Creative"
  },
  {
    id: "5",
    author: "Lisa Thompson",
    community: "Wellness Network",
    communityLogo: "from-green-500 to-green-600",
    service: "Personal Training & Nutrition",
    description: "Transform your health with personalized fitness plans and nutrition coaching. Online and in-person sessions available.",
    location: "Denver, CO",
    likes: 142,
    comments: 19,
    timestamp: "1 day ago",
    category: "Health"
  },
  {
    id: "6",
    author: "James Wilson",
    community: "Tech Freelancers",
    communityLogo: "from-blue-500 to-blue-600",
    service: "Mobile App Development",
    description: "Native iOS and Android development. React Native specialist. Let's build your app idea!",
    location: "Chicago, IL",
    likes: 97,
    comments: 15,
    timestamp: "2 days ago",
    category: "Technology"
  },
  {
    id: "7",
    author: "Rachel Kim",
    community: "Marketing Pros",
    communityLogo: "from-pink-500 to-pink-600",
    service: "Email Marketing Campaigns",
    description: "Creating high-converting email campaigns with proven track record. Mailchimp and HubSpot certified.",
    location: "Boston, MA",
    likes: 78,
    comments: 11,
    timestamp: "2 days ago",
    category: "Marketing"
  },
  {
    id: "8",
    author: "Alex Martinez",
    community: "Local Designers",
    communityLogo: "from-purple-500 to-purple-600",
    service: "UI/UX Design Services",
    description: "Offering comprehensive UI/UX design for mobile and web applications. Portfolio available upon request.",
    location: "Portland, OR",
    likes: 112,
    comments: 20,
    timestamp: "3 days ago",
    category: "Design"
  },
  {
    id: "9",
    author: "Maria Garcia",
    community: "Wellness Network",
    communityLogo: "from-green-500 to-green-600",
    service: "Yoga & Meditation Classes",
    description: "Virtual and in-person yoga sessions for all levels. Certified instructor with 8 years experience.",
    location: "Los Angeles, CA",
    likes: 134,
    comments: 16,
    timestamp: "3 days ago",
    category: "Health"
  },
  {
    id: "10",
    author: "Tom Anderson",
    community: "Local Designers",
    communityLogo: "from-purple-500 to-purple-600",
    service: "Video Editing & Production",
    description: "Professional video editing for YouTube, social media, and corporate content. Fast turnaround guaranteed!",
    location: "New York, NY",
    likes: 88,
    comments: 13,
    timestamp: "4 days ago",
    category: "Creative"
  }
];

const categories = ["All", "Design", "Technology", "Marketing", "Creative", "Health"];

const MOCK_VALID_CODES: Record<string, { name: string; privacy: "public" | "private"; requiresPasscode: boolean }> = {
  "WELC-2025": { name: "Wellness Network", privacy: "public", requiresPasscode: false },
  "DSGN-HUB1": { name: "Local Designers", privacy: "private", requiresPasscode: true },
  "TECH-FREE": { name: "Tech Freelancers", privacy: "public", requiresPasscode: false },
  "RELI-COMM": { name: "Faith & Culture Circle", privacy: "private", requiresPasscode: true },
};
const MOCK_PASSCODES: Record<string, string> = {
  "DSGN-HUB1": "design99",
  "RELI-COMM": "faith2025",
};

type JoinStatus = "idle" | "loading" | "needs-passcode" | "success" | "error-code" | "error-pass";

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const [joinOpen, setJoinOpen] = useState(true);
  const [inviteInput, setInviteInput] = useState("");
  const [passcodeInput, setPasscodeInput] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [joinStatus, setJoinStatus] = useState<JoinStatus>("idle");
  const [joinedCommunity, setJoinedCommunity] = useState("");

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  useEffect(() => {
    let filtered = allServices;
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        service =>
          service.service.toLowerCase().includes(lowerQuery) ||
          service.description.toLowerCase().includes(lowerQuery) ||
          service.category.toLowerCase().includes(lowerQuery) ||
          service.author.toLowerCase().includes(lowerQuery)
      );
    }
    if (selectedCategory !== "All") {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    setResults(filtered);
  }, [query, selectedCategory]);

  const handleJoin = () => {
    const code = inviteInput.trim().toUpperCase();
    const community = MOCK_VALID_CODES[code];

    if (!community) {
      setJoinStatus("error-code");
      return;
    }

    if (community.requiresPasscode && joinStatus !== "needs-passcode") {
      setJoinStatus("needs-passcode");
      return;
    }

    if (community.requiresPasscode) {
      setJoinStatus("loading");
      setTimeout(() => {
        if (passcodeInput.trim() === MOCK_PASSCODES[code]) {
          setJoinedCommunity(community.name);
          setJoinStatus("success");
        } else {
          setJoinStatus("error-pass");
        }
      }, 700);
      return;
    }

    setJoinStatus("loading");
    setTimeout(() => {
      setJoinedCommunity(community.name);
      setJoinStatus("success");
    }, 700);
  };

  const resetJoin = () => {
    setInviteInput("");
    setPasscodeInput("");
    setJoinStatus("idle");
    setJoinedCommunity("");
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Join by invite code panel */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-6"
        >
          <button
            onClick={() => setJoinOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
                <KeyRound size={15} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-neutral-900">Join a private community</p>
                <p className="text-xs text-neutral-400">Have an invite code or passcode? Enter it here</p>
              </div>
            </div>
            {joinOpen ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
          </button>

          <AnimatePresence>
            {joinOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-neutral-100">
                  {joinStatus === "success" ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-5 gap-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check size={22} className="text-emerald-600" strokeWidth={2.5} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-neutral-900">You've joined <span className="text-emerald-700">{joinedCommunity}</span>!</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Welcome — check your communities to get started.</p>
                      </div>
                      <button onClick={resetJoin} className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2">
                        Join another community
                      </button>
                    </motion.div>
                  ) : (
                    <div className="pt-4 space-y-3">
                      {/* Invite code */}
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Invite code</label>
                        <div className="relative">
                          <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="text"
                            value={inviteInput}
                            onChange={e => { setInviteInput(e.target.value.toUpperCase()); setJoinStatus("idle"); }}
                            placeholder="e.g. WELC-2025"
                            maxLength={12}
                            className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                              joinStatus === "error-code" ? "border-red-300 bg-red-50" : "border-neutral-200"
                            }`}
                          />
                        </div>
                        {joinStatus === "error-code" && (
                          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle size={11} /> Invalid invite code. Check and try again.
                          </p>
                        )}
                      </div>

                      {/* Passcode — shown when community requires it */}
                      <AnimatePresence>
                        {joinStatus === "needs-passcode" && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                          >
                            <label className="block text-xs font-medium text-neutral-600 mb-1.5">
                              Passcode
                              <span className="ml-1.5 text-neutral-400 font-normal">— this community requires a passcode</span>
                            </label>
                            <div className="relative">
                              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                              <input
                                type={showPasscode ? "text" : "password"}
                                value={passcodeInput}
                                onChange={e => { setPasscodeInput(e.target.value); if (joinStatus === "error-pass") setJoinStatus("needs-passcode"); }}
                                placeholder="Enter passcode"
                                autoFocus
                                className={`w-full pl-9 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all ${
                                  joinStatus === "error-pass" ? "border-red-300 bg-red-50" : "border-neutral-200"
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasscode(v => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                              >
                                {showPasscode ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                            {joinStatus === "error-pass" && (
                              <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                <AlertCircle size={11} /> Incorrect passcode. Please try again.
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex items-center justify-between gap-3 pt-1">
                        <p className="text-xs text-neutral-400">
                          {joinStatus === "needs-passcode"
                            ? "Hint: try demo code with passcode"
                            : "Try: WELC-2025 · DSGN-HUB1 · TECH-FREE"}
                        </p>
                        <button
                          onClick={handleJoin}
                          disabled={!inviteInput.trim() || joinStatus === "loading"}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            !inviteInput.trim() || joinStatus === "loading"
                              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                              : "bg-neutral-900 text-white hover:bg-neutral-700"
                          }`}
                        >
                          {joinStatus === "loading" ? (
                            <span className="flex items-center gap-1.5">
                              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                              </svg>
                              Joining…
                            </span>
                          ) : joinStatus === "needs-passcode" ? "Verify & Join" : "Join Community"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="text-neutral-600" size={28} />
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Search Results</h1>
              {query && (
                <p className="text-neutral-600">
                  Found {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
                </p>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-neutral-600">
              <Filter size={18} />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        {results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="text-neutral-400" size={32} />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">No results found</h2>
            <p className="text-neutral-600">
              Try adjusting your search terms or browse all services
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {results.map((result, index) => (
              <motion.article
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white font-medium">
                        {result.author.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-medium text-neutral-900">{result.author}</h3>
                          <span className="text-neutral-400 text-sm">in</span>
                          <div className="flex items-center gap-1">
                            <div className={`w-4 h-4 rounded-[4px] bg-gradient-to-br ${result.communityLogo} flex items-center justify-center text-white`}>
                              <Users size={10} />
                            </div>
                            <span className="text-sm font-medium text-neutral-700">{result.community}</span>
                          </div>
                        </div>
                        <p className="text-sm text-neutral-500">{result.timestamp}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-full">
                      {result.category}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h2 className="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
                    <TrendingUp size={20} className="text-neutral-700" />
                    {result.service}
                  </h2>

                  {/* Description */}
                  <p className="text-neutral-700 mb-3">{result.description}</p>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-neutral-600 text-sm">
                    <MapPin size={16} />
                    {result.location}
                  </div>
                </div>

                {/* Mock Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                  <span className="text-neutral-500 text-sm">Service Image</span>
                </div>

                {/* Post Actions */}
                <div className="p-6 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-neutral-600 hover:text-red-600 transition-colors">
                      <Heart size={20} />
                      <span className="text-sm font-medium">{result.likes}</span>
                    </button>
                    <button
                      onClick={() => toggleComments(result.id)}
                      className={`flex items-center gap-2 transition-colors ${showComments[result.id] ? 'text-blue-600' : 'text-neutral-600 hover:text-blue-600'}`}
                    >
                      <MessageCircle size={20} />
                      <span className="text-sm font-medium">{result.comments}</span>
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button className="flex items-center gap-2 text-neutral-600 hover:text-emerald-600 transition-colors" aria-label={`Call ${result.author}`}>
                            <Phone size={20} />
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-lg z-50" sideOffset={5}>
                            Call {result.author}
                            <Tooltip.Arrow className="fill-neutral-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>

                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 transition-colors" aria-label={`Chat with ${result.author}`}>
                            <MessageSquare size={20} />
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-lg z-50" sideOffset={5}>
                            Chat with {result.author}
                            <Tooltip.Arrow className="fill-neutral-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>

                      <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                        <Share2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Comments Section */}
                <AnimatePresence>
                  {showComments[result.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-neutral-100 bg-neutral-50/50 overflow-hidden rounded-b-xl"
                    >
                      <div className="p-6">
                        <h4 className="font-semibold text-neutral-900 mb-4">Comments</h4>

                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-3">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-xs flex-shrink-0">
                                U{i}
                              </div>
                              <div>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-neutral-100">
                                  <p className="text-sm font-medium text-neutral-900">User {i}</p>
                                  <p className="text-sm text-neutral-600 mt-1">
                                    {i === 1 ? "This sounds amazing! I'd love to learn more about the specifics of what you're offering." :
                                     i === 2 ? "Are there any prerequisites before getting started?" :
                                     "Sent you a direct message to discuss further!"}
                                  </p>
                                </div>
                                <span className="text-xs text-neutral-400 mt-1 ml-2 inline-block">{i * 2}h ago</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex gap-3 items-center bg-white p-2 rounded-full border border-neutral-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 flex-shrink-0 ml-1 font-medium text-xs">
                            ME
                          </div>
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-neutral-900 placeholder:text-neutral-400"
                          />
                          <button className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex-shrink-0 mr-1" aria-label="Post comment">
                            <Send size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
