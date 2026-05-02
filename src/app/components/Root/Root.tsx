import { useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router";
import { Home, Users, Shield, LogOut, Mail, MapPin, Calendar, ChevronRight, Search, ChevronLeft, Menu, Settings, HelpCircle, User, ChevronDown, Megaphone, Bell, TrendingUp, FileText, UserPlus, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useSidebar } from "../../context/SidebarContext";
import { JoinCommunityModal } from "../JoinCommunity/JoinCommunityModal";
import "./Root.css";

// Mock user data - replace with real data from Supabase
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  location: "San Francisco, CA",
  joinedDate: "January 2026",
  bio: "Passionate about connecting communities and sharing knowledge"
};

// Mock user service categories - replace with real data from Supabase
const mockUserOffering = [
  { label: "Graphic Design", color: "bg-purple-100 text-purple-700" },
  { label: "Logo Design", color: "bg-pink-100 text-pink-700" },
  { label: "UI/UX", color: "bg-indigo-100 text-indigo-700" },
  { label: "Branding", color: "bg-violet-100 text-violet-700" },
];

const mockUserSeeking = [
  { label: "Web Development", color: "bg-blue-100 text-blue-700" },
  { label: "Copywriting", color: "bg-cyan-100 text-cyan-700" },
  { label: "Photography", color: "bg-orange-100 text-orange-700" },
];

// Mock current user's posts - replace with real data from Supabase
const mockUserPosts = [
  { id: "6", service: "Brand Identity & Logo Design", community: "Local Designers", category: "Design", type: "offering" as const },
];

// Mock communities - replace with real data from Supabase
const mockUserCommunities = [
  { id: "1", name: "Local Designers", color: "from-purple-500 to-pink-500", notifications: 3, isAdmin: true, isCreator: true },
  { id: "2", name: "Tech Freelancers", color: "from-blue-500 to-cyan-500", notifications: 7, isAdmin: false, isCreator: false },
  { id: "3", name: "Marketing Pros", color: "from-green-500 to-emerald-500", notifications: 0, isAdmin: true, isCreator: false },
  { id: "4", name: "Photography Community", color: "from-orange-500 to-red-500", notifications: 2, isAdmin: false, isCreator: true },
  { id: "5", name: "Wellness Network", color: "from-teal-500 to-green-500", notifications: 1, isAdmin: false, isCreator: false }
];

// Mock notification counts - replace with real data from Supabase
const mockNotifications = {
  feed: 12, // New posts in feed
  admin: 4, // Pending posts to review
  announcements: 8, // New announcements across all communities
  reminders: 3 // Pending reminders across all communities
};

// Mock communities data for sidebar - replace with real data from Supabase
const mockCommunitiesData: Record<string, any> = {
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

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  const [searchQuery, setSearchQuery] = useState("");
  const [offeringOpen, setOfferingOpen] = useState(true);
  const [seekingOpen, setSeekingOpen] = useState(true);
  const [myPostsOpen, setMyPostsOpen] = useState(true);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useSidebar();

  // Check if we're on a community detail page
  const communityMatch = location.pathname.match(/^\/community\/(\d+)$/);
  const currentCommunityId = communityMatch ? communityMatch[1] : null;
  const currentCommunity = currentCommunityId ? mockCommunitiesData[currentCommunityId] : null;

  // Mock auth state - replace with real auth when Supabase is connected
  const isAuthenticated = !isAuthPage;
  const isAdmin = true; // Mock admin status

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-neutral-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Link to="/" className="text-2xl font-bold text-neutral-900 whitespace-nowrap">
                CommunityHub
              </Link>

              {/* Persistent Home button — always visible next to logo */}
              <Link
                to="/"
                aria-label="Go to home"
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors flex-shrink-0 text-neutral-900 hover:bg-neutral-100"
              >
                <Home size={18} />
              </Link>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for services, jobs, or skills..."
                    className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent focus:bg-white transition-colors text-sm"
                  />
                </div>
              </form>

              <div className="hidden lg:flex items-center gap-4">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors relative whitespace-nowrap ${
                    location.pathname === "/"
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <Home size={18} />
                  <span className="hidden xl:inline">Feed</span>
                  {mockNotifications.feed > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {mockNotifications.feed > 9 ? '9+' : mockNotifications.feed}
                    </span>
                  )}
                </Link>

                <Link
                  to="/communities"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    location.pathname === "/communities"
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  <Users size={18} />
                  <span className="hidden xl:inline">Communities</span>
                </Link>

                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors whitespace-nowrap text-sm"
                >
                  <UserPlus size={18} />
                  <span className="hidden xl:inline">Join</span>
                </button>
              </div>
            </div>

            {/* Announcements and Reminders Icons */}
            <div className="flex items-center gap-2">
              <button
                className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Announcements"
              >
                <Megaphone size={18} className="text-neutral-600" />
                {mockNotifications.announcements > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {mockNotifications.announcements > 9 ? '9+' : mockNotifications.announcements}
                  </span>
                )}
              </button>

              <button
                className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Reminders"
              >
                <Bell size={18} className="text-neutral-600" />
                {mockNotifications.reminders > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {mockNotifications.reminders > 9 ? '9+' : mockNotifications.reminders}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors outline-none">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white text-sm font-medium">
                    {mockUser.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <ChevronDown size={16} className="text-neutral-600" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-xl border border-neutral-200 shadow-lg p-2 z-50"
                  sideOffset={8}
                  align="end"
                >
                  {/* User Info */}
                  <div className="px-3 py-2 mb-2 border-b border-neutral-100">
                    <p className="font-medium text-neutral-900 text-sm">{mockUser.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{mockUser.email}</p>
                  </div>

                  {/* Menu Items */}
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      to="/my-posts"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                    >
                      <FileText size={16} />
                      My Posts
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </DropdownMenu.Item>

                  {isAdmin && (
                    <DropdownMenu.Item asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                      >
                        <Shield size={16} />
                        Admin Panel
                      </Link>
                    </DropdownMenu.Item>
                  )}

                  <DropdownMenu.Item asChild>
                    <Link
                      to="/help"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-50 outline-none cursor-pointer transition-colors"
                    >
                      <HelpCircle size={16} />
                      Help & Support
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Separator className="h-px bg-neutral-200 my-2" />

                  <DropdownMenu.Item asChild>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 outline-none cursor-pointer w-full transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </motion.nav>

      {/* Main Layout with Sidebar */}
      <div className="flex relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed && (
            <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="hidden md:block w-80 bg-white border-r border-neutral-200 h-full overflow-y-auto flex-shrink-0 relative"
            >
              <div className="p-6">
                {/* Conditional: Show Community Info or User Profile */}
                {currentCommunity ? (
                  /* Community Info Section */
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentCommunity.color} flex items-center justify-center flex-shrink-0`}>
                          <Users className="text-white" size={28} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-neutral-900">{currentCommunity.name}</h3>
                          <span className="inline-block px-2 py-0.5 bg-neutral-100 text-neutral-700 text-xs rounded-full mt-1">
                            {currentCommunity.category}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 mb-4">{currentCommunity.description}</p>

                      <div className="flex items-center gap-6 mb-4">
                        <div>
                          <p className="text-lg font-bold text-neutral-900">{currentCommunity.members.toLocaleString()}</p>
                          <p className="text-xs text-neutral-500">Members</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-neutral-900">{currentCommunity.posts.toLocaleString()}</p>
                          <p className="text-xs text-neutral-500">Posts</p>
                        </div>
                      </div>

                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors text-sm">
                        <Settings size={14} />
                        Community Settings
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-neutral-200 mb-6"></div>
                  </>
                ) : (
                  /* User Profile Section */
                  <>
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white text-xl font-bold">
                          {mockUser.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-neutral-900">{mockUser.name}</h3>
                          <p className="text-sm text-neutral-500">Community Member</p>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-600 mb-3">{mockUser.bio}</p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Mail size={14} />
                          {mockUser.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <MapPin size={14} />
                          {mockUser.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Calendar size={14} />
                          Joined {mockUser.joinedDate}
                        </div>
                      </div>

                      {/* Community Stats */}
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-neutral-50 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-neutral-900">{mockUserCommunities.length}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">Communities</p>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-neutral-900">{mockUserCommunities.filter(c => c.isAdmin).length}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">Admin Access</p>
                        </div>
                        <div className="bg-neutral-50 rounded-xl p-3 text-center">
                          <p className="text-xl font-bold text-neutral-900">{mockUserCommunities.filter(c => c.isCreator).length}</p>
                          <p className="text-[11px] text-neutral-500 mt-0.5 leading-tight">Created</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-neutral-200 mb-6"></div>
                  </>
                )}

                {/* Services I Provide & Seek — shown on home/feed pages */}
                {!currentCommunity && (
                  <>
                    {/* What I Offer */}
                    <div className="mb-4">
                      <button
                        onClick={() => setOfferingOpen(o => !o)}
                        className="flex items-center justify-between w-full mb-2.5 group"
                      >
                        <div className="flex items-center gap-1.5">
                          <TrendingUp size={14} className="text-green-600" />
                          <h4 className="text-sm font-semibold text-neutral-900">Services I Provide</h4>
                        </div>
                        <motion.div
                          animate={{ rotate: offeringOpen ? 0 : -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={14} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                        </motion.div>
                      </button>
                      <AnimatePresence initial={false}>
                        {offeringOpen && (
                          <motion.div
                            key="offering-tags"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {mockUserOffering.map(tag => (
                                <span key={tag.label} className={`px-2.5 py-1 rounded-full text-xs font-medium ${tag.color}`}>
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* What I Seek */}
                    <div className="mb-6">
                      <button
                        onClick={() => setSeekingOpen(o => !o)}
                        className="flex items-center justify-between w-full mb-2.5 group"
                      >
                        <div className="flex items-center gap-1.5">
                          <Search size={14} className="text-blue-600" />
                          <h4 className="text-sm font-semibold text-neutral-900">Services I Seek</h4>
                        </div>
                        <motion.div
                          animate={{ rotate: seekingOpen ? 0 : -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown size={14} className="text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                        </motion.div>
                      </button>
                      <AnimatePresence initial={false}>
                        {seekingOpen && (
                          <motion.div
                            key="seeking-tags"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {mockUserSeeking.map(tag => (
                                <span key={tag.label} className={`px-2.5 py-1 rounded-full text-xs font-medium ${tag.color}`}>
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* My Posts subtle link */}
                    <Link
                      to="/my-posts"
                      className="flex items-center justify-between mb-5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors group"
                    >
                      <div className="flex items-center gap-1.5">
                        <FileText size={12} />
                        <span>My Posts</span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-neutral-100 group-hover:bg-neutral-200 rounded-full text-[10px] font-medium transition-colors">
                        {mockUserPosts.length}
                      </span>
                    </Link>

                    {/* Divider */}
                    <div className="h-px bg-neutral-200 mb-6" />
                  </>
                )}

                {/* Communities Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-neutral-900">My Communities</h4>
                    <Link
                      to="/communities"
                      className="text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 px-2 py-1 rounded-lg transition-colors"
                    >
                      View all
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {mockUserCommunities.map((community) => {
                      const isActive = currentCommunityId === community.id;
                      return (
                        <Link
                          key={community.id}
                          to={`/community/${community.id}`}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors group relative ${
                            isActive
                              ? 'bg-neutral-100 border border-neutral-200'
                              : 'hover:bg-neutral-50'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${community.color} flex items-center justify-center flex-shrink-0 relative`}>
                            <Users className="text-white" size={18} />
                            {community.notifications > 0 && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium border-2 border-white">
                                {community.notifications > 9 ? '9+' : community.notifications}
                              </span>
                            )}
                            {community.isAdmin && (
                              <Tooltip.Root>
                                <Tooltip.Trigger asChild>
                                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center border-2 border-white cursor-default">
                                    <svg viewBox="0 0 512 462.24" width="9" height="9" fill="white" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd">
                                      <path d="M211.02 0C132.6 49.71 61.75 73.23.95 67.67-9.67 282.45 69.65 409.3 210.21 462.24c15.15-5.53 29.6-11.96 43.31-19.32a36.277 36.277 0 0 1-12.56-8.15l-.06-.07-.06.07c-3-3-5.48-6.53-7.27-10.43-7.56 3.5-15.34 6.72-23.35 9.64C86.85 387.52 17.23 276.18 26.54 87.65c53.37 4.88 115.56-15.76 184.4-59.4 59.56 46.27 121.03 59.82 183.68 56.54.52 19.96.27 38.97-.7 57.09 8.27 1.21 16.35 4 24.15 8.57 2.25-26.82 3.03-55.47 2.22-86.04C348.92 68.15 278.88 52.71 211.02 0zm55.15 413.12a3.67 3.67 0 0 1-3.68-3.68c0-1.05.15-2.08.39-3.11 5.91-46.78 26.59-47.62 52.6-54.39 7.75-2.02 21.94-3.1 30.2-10.33 4.55-4 7.3-12.13 6.2-18-6.27-5.83-11.11-12.13-12.21-24.14l-.75.01c-1.75-.03-3.44-.41-5-1.31-3.47-1.99-5.37-5.74-6.29-10.07-1.16-5.45-.77-11.93-.2-16.01l.2-.81c1.21-3.37 2.71-5.2 4.62-5.99l.05-.03c-.87-16.23 1.87-41.94-14.79-47 32.91-40.68 70.87-62.82 99.37-26.62 31.75 1.67 45.91 48.47 26.19 73.65h-.83c1.89.79 3.39 2.62 4.6 5.99l.22.81c.57 4.08.95 10.56-.22 16.01-.92 4.33-2.81 8.08-6.28 10.07-1.56.9-3.25 1.28-4.99 1.31l-.76-.01c-1.09 12.01-5.93 18.31-12.2 24.14-1.12 5.87 1.65 14 6.19 18 8.27 7.23 22.45 8.3 30.22 10.33 26 6.77 46.68 7.61 52.59 54.39.24 1.03.39 2.06.39 3.11 0 2.04-1.65 3.68-3.68 3.68H266.17zM208.74 74.84c-53.04 33.61-100.95 49.51-142.06 45.76-7.18 145.23 46.45 231 141.5 266.8.6-.22 1.19-.45 1.79-.67V75.78l-1.23-.94z"/>
                                    </svg>
                                  </span>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                  <Tooltip.Content
                                    className="bg-neutral-900 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-lg z-50"
                                    sideOffset={5}
                                  >
                                    Admin
                                    <Tooltip.Arrow className="fill-neutral-900" />
                                  </Tooltip.Content>
                                </Tooltip.Portal>
                              </Tooltip.Root>
                            )}
                          </div>
                          <span className={`text-sm font-medium flex-1 truncate ${
                            isActive ? 'text-neutral-900' : 'text-neutral-700'
                          }`}>
                            {community.name}
                          </span>
                          <ChevronRight size={16} className={`transition-colors ${
                            isActive ? 'text-neutral-600' : 'text-neutral-400 group-hover:text-neutral-600'
                          }`} />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Toggle Button - Inside the panel */}
              <div className="absolute right-0 top-6 h-12 w-8 flex items-center justify-end">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="w-6 h-12 bg-neutral-50 border-l border-t border-b border-neutral-200 rounded-l-lg flex items-center justify-center hover:bg-neutral-100 transition-colors group"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft size={16} className="text-neutral-600 group-hover:text-neutral-900 transition-colors" />
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle Button when collapsed */}
        {isSidebarCollapsed && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsSidebarCollapsed(false)}
            className="hidden md:flex fixed left-0 top-20 z-50 w-8 h-12 bg-neutral-50 border border-neutral-200 border-l-0 rounded-r-lg items-center justify-center hover:bg-neutral-100 transition-colors group"
            aria-label="Expand sidebar"
          >
            <ChevronRight size={16} className="text-neutral-600 group-hover:text-neutral-900 transition-colors" />
          </motion.button>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <JoinCommunityModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
    </div>
  );
}
