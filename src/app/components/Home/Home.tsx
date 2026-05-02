import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Share2, MapPin, TrendingUp, ChevronLeft, ChevronRight, Users, Phone, MessageSquare, Send, Plus } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CreatePostModal } from "../CreatePost/CreatePost";
import "./Home.css";

interface Post {
  id: string;
  author: string;
  community: string;
  communityLogo: string;
  service: string;
  description: string;
  location: string;
  media?: Array<{
    type: "image" | "video";
    url?: string;
  }>;
  likes: number;
  comments: number;
  timestamp: string;
  status?: "pending" | "approved" | "rejected";
  category: string;
  type: "seeking" | "offering";
}

// Mock data - replace with real data from Supabase
const mockPosts: Post[] = [
  {
    id: "1",
    author: "Sarah Johnson",
    community: "Local Designers",
    communityLogo: "from-purple-500 to-purple-600",
    service: "Custom Logo Design",
    description: "Specializing in modern, minimalist logos for startups and small businesses. 10+ years experience. Let's bring your brand to life!",
    location: "San Francisco, CA",
    media: [
      { type: "image" },
      { type: "image" },
      { type: "image" }
    ],
    likes: 124,
    comments: 18,
    timestamp: "2 hours ago",
    status: "approved",
    category: "Design",
    type: "offering"
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
    status: "approved",
    category: "Development",
    type: "offering"
  },
  {
    id: "3",
    author: "Emily Rodriguez",
    community: "Marketing Pros",
    communityLogo: "from-pink-500 to-pink-600",
    service: "Social Media Management",
    description: "Grow your online presence with data-driven strategies. Instagram, TikTok, LinkedIn expertise. Free consultation!",
    location: "Miami, FL",
    media: [
      { type: "video" },
      { type: "image" }
    ],
    likes: 156,
    comments: 24,
    timestamp: "8 hours ago",
    status: "approved",
    category: "Marketing",
    type: "offering"
  },
  {
    id: "4",
    author: "David Park",
    community: "Photography Community",
    communityLogo: "from-orange-500 to-orange-600",
    service: "Event Photography",
    description: "Capturing your special moments with artistic vision. Weddings, corporate events, portraits. Check out my portfolio!",
    location: "Seattle, WA",
    media: [
      { type: "image" }
    ],
    likes: 203,
    comments: 31,
    timestamp: "1 day ago",
    status: "approved",
    category: "Photography",
    type: "offering"
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
    status: "approved",
    category: "Health & Wellness",
    type: "offering"
  }
];

export function Home() {
  const [posts] = useState<Post[]>(mockPosts);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<Record<string, number>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handlePrevMedia = (postId: string, mediaLength: number) => {
    setCurrentMediaIndex(prev => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + mediaLength) % mediaLength
    }));
  };

  const handleNextMedia = (postId: string, mediaLength: number) => {
    setCurrentMediaIndex(prev => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % mediaLength
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Feed */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white font-medium">
                      {post.author.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-medium text-neutral-900">{post.author}</h3>
                        <span className="text-neutral-400 text-sm">in</span>
                        <div className="flex items-center gap-1">
                          <div className={`w-4 h-4 rounded-[4px] bg-gradient-to-br ${post.communityLogo} flex items-center justify-center text-white text-[8px] font-bold`}>
                            <Users size={10} />
                          </div>
                          <span className="text-sm font-medium text-neutral-700">{post.community}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {post.location}
                        </div>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                    post.type === "offering"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {post.type === "offering" ? "Offering Service" : "Seeking Service"}
                  </span>
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-md">
                    {post.category}
                  </span>
                </div>

                {/* Service Title */}
                <h2 className="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
                  <TrendingUp size={20} className="text-neutral-700" />
                  {post.service}
                </h2>

                {/* Description */}
                <p className="text-neutral-700">{post.description}</p>
              </div>

              {/* Media - Conditional */}
              {post.media && post.media.length > 0 && (
                <div className="relative w-full h-64 bg-gradient-to-br from-neutral-200 to-neutral-300">
                  {/* Current Media */}
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {post.media[currentMediaIndex[post.id] || 0].type === "image" ? (
                      <>
                        <div className="w-16 h-16 bg-neutral-400 rounded-lg mb-2 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-neutral-500 text-sm">Image {(currentMediaIndex[post.id] || 0) + 1}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-neutral-400 rounded-lg mb-2 flex items-center justify-center">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-neutral-500 text-sm">Video {(currentMediaIndex[post.id] || 0) + 1}</span>
                      </>
                    )}
                  </div>

                  {/* Navigation Arrows - Only show if multiple media */}
                  {post.media.length > 1 && (
                    <>
                      <button
                        onClick={() => handlePrevMedia(post.id, post.media!.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all"
                        aria-label="Previous media"
                      >
                        <ChevronLeft size={16} className="text-neutral-700" />
                      </button>
                      <button
                        onClick={() => handleNextMedia(post.id, post.media!.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow transition-all"
                        aria-label="Next media"
                      >
                        <ChevronRight size={16} className="text-neutral-700" />
                      </button>

                      {/* Indicators */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {post.media.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentMediaIndex(prev => ({ ...prev, [post.id]: idx }))}
                            className={`h-1.5 rounded-full transition-all ${
                              (currentMediaIndex[post.id] || 0) === idx
                                ? 'w-6 bg-white'
                                : 'w-1.5 bg-white/50'
                            }`}
                            aria-label={`Go to media ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Engagement Actions (Bottom) */}
              <div className="px-6 py-4 border-t border-neutral-100 flex items-center gap-6">
                <button className="flex items-center gap-2 text-neutral-600 hover:text-red-600 transition-colors">
                  <Heart size={20} />
                  <span className="font-medium">{post.likes}</span>
                </button>
                <button 
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center gap-2 transition-colors ${showComments[post.id] ? 'text-blue-600' : 'text-neutral-600 hover:text-blue-600'}`}
                >
                  <MessageCircle size={20} />
                  <span className="font-medium">{post.comments}</span>
                </button>
                
                <div className="flex items-center gap-4 ml-auto">
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-emerald-600 transition-colors" aria-label={`Call ${post.author}`}>
                        <Phone size={20} />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-lg"
                        sideOffset={5}
                      >
                        Call {post.author}
                        <Tooltip.Arrow className="fill-neutral-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>

                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button className="flex items-center gap-2 text-neutral-600 hover:text-indigo-600 transition-colors" aria-label={`Chat with ${post.author}`}>
                        <MessageSquare size={20} />
                      </button>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-lg"
                        sideOffset={5}
                      >
                        Chat with {post.author}
                        <Tooltip.Arrow className="fill-neutral-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>

                  <button className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                    <Share2 size={20} />
                    <span className="font-medium hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>

              {/* Expandable Comments Section */}
              <AnimatePresence>
                {showComments[post.id] && (
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
                        {/* Mock Comments */}
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
                      
                      {/* Input section */}
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
      </div>

      {/* Floating Create Post Button */}
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setIsCreatePostOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-neutral-900 text-white rounded-full shadow-lg hover:bg-neutral-800 hover:shadow-xl transition-all flex items-center justify-center z-50"
            aria-label="Create a post"
          >
            <Plus size={24} />
          </motion.button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-neutral-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg"
            sideOffset={5}
          >
            Create a post
            <Tooltip.Arrow className="fill-neutral-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </div>
  );
}
