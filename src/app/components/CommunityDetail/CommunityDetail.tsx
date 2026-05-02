import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle, Share2, MapPin, TrendingUp, Users, ArrowLeft, Settings as SettingsIcon, Plus, Megaphone, Clock, Calendar, AlertCircle, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, Phone, MessageSquare, Send } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CreatePostModal } from "../CreatePost/CreatePost";
import "./CommunityDetail.css";

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
  category: string;
  type: "seeking" | "offering";
}

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  color: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "event" | "info" | "alert";
  date?: string;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  actionUrl?: string;
  completed?: boolean;
}

// Mock data - replace with real data from Supabase
const mockCommunities: Record<string, Community> = {
  "1": {
    id: "1",
    name: "Local Designers",
    description: "Creative professionals sharing design services and collaborating on projects",
    members: 1247,
    posts: 3891,
    category: "Design",
    color: "from-purple-500 to-pink-500"
  },
  "2": {
    id: "2",
    name: "Tech Freelancers",
    description: "Software developers and tech consultants offering their expertise",
    members: 2103,
    posts: 5672,
    category: "Technology",
    color: "from-blue-500 to-cyan-500"
  },
  "3": {
    id: "3",
    name: "Marketing Pros",
    description: "Marketing specialists and growth hackers helping businesses scale",
    members: 892,
    posts: 2341,
    category: "Marketing",
    color: "from-green-500 to-emerald-500"
  },
  "4": {
    id: "4",
    name: "Photography Community",
    description: "Photographers showcasing their work and offering professional services",
    members: 1534,
    posts: 4219,
    category: "Creative",
    color: "from-orange-500 to-red-500"
  },
  "5": {
    id: "5",
    name: "Wellness Network",
    description: "Health and wellness professionals providing coaching and training services",
    members: 678,
    posts: 1823,
    category: "Health",
    color: "from-teal-500 to-green-500"
  }
};

const mockCommunityPosts: Record<string, Post[]> = {
  "1": [
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
      category: "Graphic Design",
      type: "offering"
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
      category: "UI/UX Design",
      type: "offering"
    }
  ],
  "2": [
    {
      id: "2",
      author: "Michael Chen",
      community: "Tech Freelancers",
      communityLogo: "from-blue-500 to-blue-600",
      service: "Full-Stack Development",
      description: "Building scalable web applications with React, Node.js, and cloud infrastructure. Available for project-based work.",
      location: "Austin, TX",
      media: [
        { type: "video" },
        { type: "image" }
      ],
      likes: 89,
      comments: 12,
      timestamp: "5 hours ago",
      category: "Web Development",
      type: "offering"
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
      category: "Mobile Development",
      type: "offering"
    }
  ],
  "3": [
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
      category: "Social Media",
      type: "offering"
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
      category: "Email Marketing",
      type: "offering"
    }
  ],
  "4": [
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
      category: "Photography",
      type: "offering"
    }
  ],
  "5": [
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
      category: "Fitness",
      type: "offering"
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
      category: "Wellness",
      type: "offering"
    }
  ]
};

// Mock announcements - replace with real data from Supabase
const mockAnnouncements: Record<string, Announcement[]> = {
  "1": [
    {
      id: "a1",
      title: "Design Meetup - April 2026",
      message: "Join us for our monthly design meetup! Share your latest projects and get feedback from fellow designers.",
      type: "event",
      date: "April 20, 2026"
    },
    {
      id: "a2",
      title: "Portfolio Review Sessions",
      message: "Free portfolio reviews happening every Friday! Sign up to get constructive feedback from experienced designers.",
      type: "info"
    },
    {
      id: "a3",
      title: "New Community Guidelines",
      message: "We've updated our community guidelines. Please review them to ensure a positive experience for everyone.",
      type: "alert"
    },
    {
      id: "a4",
      title: "Design Contest Winners Announced!",
      message: "Congratulations to all participants! Winners will be featured in our newsletter and receive exclusive prizes.",
      type: "info"
    },
    {
      id: "a5",
      title: "Exclusive Workshop: Typography Mastery",
      message: "Limited seats available! Learn advanced typography techniques from industry experts. Early bird discount ends soon!",
      type: "event",
      date: "April 25, 2026"
    }
  ],
  "2": [
    {
      id: "a4",
      title: "Tech Workshop: Cloud Architecture",
      message: "Learn best practices for cloud-native applications. Limited seats available!",
      type: "event",
      date: "April 18, 2026"
    },
    {
      id: "a5",
      title: "Hackathon Alert",
      message: "Join our community hackathon next month! Collaborate with fellow developers and win prizes.",
      type: "event",
      date: "May 5-7, 2026"
    }
  ],
  "3": [
    {
      id: "a6",
      title: "Marketing Trends Webinar",
      message: "Discover the latest marketing trends and strategies for 2026. Free for all members!",
      type: "event",
      date: "April 22, 2026"
    }
  ],
  "4": [
    {
      id: "a7",
      title: "Photography Exhibition",
      message: "Showcase your best work at our annual community exhibition. Submissions open now!",
      type: "event",
      date: "May 1, 2026"
    }
  ],
  "5": [
    {
      id: "a8",
      title: "Wellness Challenge",
      message: "Join our 30-day wellness challenge! Track your progress and win exclusive rewards.",
      type: "event",
      date: "April 15, 2026"
    }
  ]
};

// Mock reminders - replace with real data from Supabase
const mockReminders: Record<string, Reminder[]> = {
  "1": [
    {
      id: "r1",
      title: "Design Contest Submission Deadline",
      description: "Submit your designs for our monthly contest",
      dueDate: new Date("2026-04-15T23:59:59"),
      actionUrl: "#",
      completed: true
    },
    {
      id: "r2",
      title: "Workshop Registration Closes",
      description: "Register for the Advanced UI/UX workshop",
      dueDate: new Date("2026-04-13T18:00:00"),
      actionUrl: "#",
      completed: false
    },
    {
      id: "r3",
      title: "Meetup RSVP Required",
      description: "Confirm your attendance for the monthly design meetup",
      dueDate: new Date("2026-04-19T20:00:00"),
      actionUrl: "#",
      completed: true
    },
    {
      id: "r4",
      title: "Typography Workshop Early Bird",
      description: "Last chance to get 30% off on workshop tickets",
      dueDate: new Date("2026-04-14T23:59:59"),
      actionUrl: "#",
      completed: false
    },
    {
      id: "r5",
      title: "Portfolio Showcase Sign-up",
      description: "Reserve your spot to showcase work at next event",
      dueDate: new Date("2026-04-16T17:00:00"),
      actionUrl: "#",
      completed: false
    }
  ],
  "2": [
    {
      id: "r3",
      title: "Hackathon Team Registration",
      description: "Form your team and register for the hackathon",
      dueDate: new Date("2026-04-20T23:59:59"),
      actionUrl: "#"
    }
  ],
  "3": [
    {
      id: "r4",
      title: "Webinar RSVP Deadline",
      description: "Reserve your spot for the marketing trends webinar",
      dueDate: new Date("2026-04-21T12:00:00"),
      actionUrl: "#"
    }
  ],
  "4": [
    {
      id: "r5",
      title: "Photo Exhibition Submission",
      description: "Submit your photos for the annual exhibition",
      dueDate: new Date("2026-04-25T23:59:59"),
      actionUrl: "#"
    }
  ],
  "5": [
    {
      id: "r6",
      title: "Wellness Challenge Sign-up",
      description: "Join the 30-day wellness challenge",
      dueDate: new Date("2026-04-14T23:59:59"),
      actionUrl: "#"
    }
  ]
};

function CountdownTimer({ dueDate }: { dueDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = dueDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [dueDate]);

  return (
    <div className="flex items-center gap-0.5 text-xs">
      {timeLeft.days > 0 && (
        <>
          <span className="text-neutral-700">{timeLeft.days}d</span>
          <span className="text-neutral-300">:</span>
        </>
      )}
      <span className="text-neutral-700">{String(timeLeft.hours).padStart(2, '0')}h</span>
      <span className="text-neutral-300">:</span>
      <span className="text-neutral-700">{String(timeLeft.minutes).padStart(2, '0')}m</span>
    </div>
  );
}

export function CommunityDetail() {
  const { id } = useParams();
  const { isSidebarCollapsed } = useSidebar();
  const community = id ? mockCommunities[id] : null;
  const posts = id ? mockCommunityPosts[id] || [] : [];
  const announcements = id ? mockAnnouncements[id] || [] : [];
  const allReminders = id ? mockReminders[id] || [] : [];
  const [ignoredReminders, setIgnoredReminders] = useState<string[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  // Filter out ignored reminders
  const reminders = allReminders.filter(r => !ignoredReminders.includes(r.id));
  const [currentMediaIndex, setCurrentMediaIndex] = useState<Record<string, number>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleIgnoreReminder = (reminderId: string) => {
    setIgnoredReminders([...ignoredReminders, reminderId]);
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

  // Reset state when community changes
  useEffect(() => {
    setCurrentAnnouncement(0);
    setIgnoredReminders([]);
    setCurrentMediaIndex({});
    setShowComments({});
  }, [id]);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [announcements.length]);

  const goToPrevAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const goToNextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
  };

  if (!community) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Community not found</h2>
          <Link to="/communities" className="text-neutral-600 hover:text-neutral-900">
            Back to communities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Community Header - Only show when sidebar is collapsed */}
      {isSidebarCollapsed && (
        <div className="bg-white border-b border-neutral-200 sticky top-16 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${community.color} flex items-center justify-center flex-shrink-0`}>
                <Users className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">{community.name}</h1>
                <p className="text-sm text-neutral-500">{community.members.toLocaleString()} members</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Announcements Carousel */}
        {announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="relative rounded-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentAnnouncement}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {(() => {
                    const announcement = announcements[currentAnnouncement];
                    const bgColors = {
                      event: "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200",
                      info: "bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200",
                      alert: "bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200"
                    };

                    const textColors = {
                      event: "text-blue-900",
                      info: "text-purple-900",
                      alert: "text-amber-900"
                    };

                    const iconBgColors = {
                      event: "bg-blue-200/50",
                      info: "bg-purple-200/50",
                      alert: "bg-amber-200/50"
                    };

                    return (
                      <div className={`${bgColors[announcement.type]} rounded-xl p-4 relative`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 ${iconBgColors[announcement.type]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Megaphone size={16} className={textColors[announcement.type]} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm font-bold mb-0.5 ${textColors[announcement.type]}`}>{announcement.title}</h3>
                            <p className="text-neutral-700 text-xs leading-relaxed">{announcement.message}</p>
                            {announcement.date && (
                              <div className="flex items-center gap-1 text-neutral-600 text-xs mt-1">
                                <Calendar size={10} />
                                {announcement.date}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Number Navigation */}
                        {announcements.length > 1 && (
                          <div className="absolute bottom-2 right-2 flex items-center gap-1">
                            {announcements.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentAnnouncement(index)}
                                className={`w-5 h-5 rounded text-xs font-medium transition-all ${
                                  currentAnnouncement === index
                                    ? 'bg-white/80 text-neutral-900'
                                    : 'bg-white/30 text-neutral-700 hover:bg-white/50'
                                }`}
                                aria-label={`Go to announcement ${index + 1}`}
                              >
                                {index + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Reminders Section */}
        {reminders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <div className="bg-white rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="text-neutral-500" size={14} />
                <h3 className="text-sm font-bold text-neutral-900">Reminders</h3>
                <span className="text-xs text-neutral-400">
                  ({reminders.length})
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`relative flex-shrink-0 w-80 p-2.5 border rounded-lg transition-colors group ${
                      reminder.completed
                        ? 'border-green-200 bg-green-50'
                        : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
                    }`}
                  >
                    {/* Ignore button */}
                    <button
                      onClick={() => handleIgnoreReminder(reminder.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-neutral-400 hover:bg-neutral-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Ignore reminder"
                    >
                      <X size={10} />
                    </button>

                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h4 className="font-medium text-neutral-900 text-xs truncate flex-1">{reminder.title}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 text-neutral-600">
                          <Clock size={10} />
                          <CountdownTimer dueDate={reminder.dueDate} />
                        </div>
                        {reminder.actionUrl && (
                          <button
                            className={`px-2 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                              reminder.completed
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-neutral-900 text-white hover:bg-neutral-800'
                            }`}
                          >
                            {reminder.completed ? 'Edit' : 'Sign Up'}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 truncate">{reminder.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Community Posts */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-neutral-900">Community Posts</h2>

          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
              <p className="text-neutral-600">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
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
                            <div className={`w-4 h-4 rounded-[4px] bg-gradient-to-br ${post.communityLogo} flex items-center justify-center text-white`}>
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
                <div className="px-6 py-4 border-t border-neutral-100 flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Heart size={18} />
                    <span className="font-medium text-sm">{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${showComments[post.id] ? 'text-blue-600 bg-blue-50' : 'text-neutral-600 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    <MessageCircle size={18} />
                    <span className="font-medium text-sm">{post.comments}</span>
                  </button>
                  
                  <div className="flex items-center gap-1 ml-auto">
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button className="flex items-center gap-2 p-2 rounded-lg text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" aria-label={`Call ${post.author}`}>
                          <Phone size={18} />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-lg z-50"
                          sideOffset={5}
                        >
                          Call {post.author}
                          <Tooltip.Arrow className="fill-neutral-900" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>

                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button className="flex items-center gap-2 p-2 rounded-lg text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" aria-label={`Chat with ${post.author}`}>
                          <MessageSquare size={18} />
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="bg-neutral-900 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-lg z-50"
                          sideOffset={5}
                        >
                          Chat with {post.author}
                          <Tooltip.Arrow className="fill-neutral-900" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>

                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors">
                      <Share2 size={18} />
                      <span className="font-medium text-sm hidden sm:inline">Share</span>
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
            ))
          )}
        </div>
      </div>

      {/* Floating Create Post Button */}
      <Tooltip.Provider delayDuration={300}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setIsCreatePostOpen(true)}
              className="fixed bottom-8 right-8 w-14 h-14 bg-neutral-900 text-white rounded-full shadow-lg hover:bg-neutral-800 hover:shadow-xl transition-all flex items-center justify-center group z-50"
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
      </Tooltip.Provider>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        defaultCommunityId={id}
      />
    </div>
  );
}
