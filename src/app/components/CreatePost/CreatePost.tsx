import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Users, Check, Image, MapPin, ChevronDown, ChevronUp, Plus, Trash2, Wifi, TrendingUp, ArrowLeft, Eye } from "lucide-react";

const allCommunities = [
  { id: "1", name: "Local Designers", color: "from-purple-500 to-pink-500", category: "Design" },
  { id: "2", name: "Tech Freelancers", color: "from-blue-500 to-cyan-500", category: "Technology" },
  { id: "3", name: "Marketing Pros", color: "from-green-500 to-emerald-500", category: "Marketing" },
  { id: "4", name: "Photography Community", color: "from-orange-500 to-red-500", category: "Creative" },
  { id: "5", name: "Wellness Network", color: "from-teal-500 to-green-500", category: "Health" },
];

const categoryOptions = [
  "Design", "Technology", "Marketing", "Photography", "Health & Wellness",
  "Education", "Finance", "Transportation", "Food & Beverage", "Consulting",
  "Creative", "Legal", "Real Estate", "Other",
];

interface CommunityContent {
  serviceTitle: string;
  category: string;
  description: string;
  price: string;
  priceType: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCommunityId?: string;
}

const emptyContent = (): CommunityContent => ({
  serviceTitle: "",
  category: "",
  description: "",
  price: "",
  priceType: "",
});

const offeringRateTypes = ["/ hour", "/ day", "/ project", "Fixed price", "Free", "Negotiable"];
const seekingRateTypes = ["/ hour", "/ day", "/ project", "Total budget", "Open to discuss"];

const communityPricing: Record<string, { low: number; median: number; high: number }> = {
  "Design":           { low: 35,  median: 75,  high: 200 },
  "Technology":       { low: 50,  median: 110, high: 250 },
  "Marketing":        { low: 30,  median: 65,  high: 150 },
  "Photography":      { low: 50,  median: 100, high: 220 },
  "Health & Wellness":{ low: 40,  median: 80,  high: 175 },
  "Education":        { low: 25,  median: 55,  high: 130 },
  "Finance":          { low: 75,  median: 175, high: 400 },
  "Transportation":   { low: 20,  median: 45,  high: 100 },
  "Food & Beverage":  { low: 25,  median: 55,  high: 120 },
  "Consulting":       { low: 80,  median: 185, high: 400 },
  "Creative":         { low: 30,  median: 70,  high: 160 },
  "Legal":            { low: 100, median: 275, high: 600 },
  "Real Estate":      { low: 50,  median: 160, high: 450 },
  "Other":            { low: 20,  median: 75,  high: 200 },
};
const defaultPricing = { low: 20, median: 75, high: 250 };

export function CreatePostModal({ isOpen, onClose, defaultCommunityId }: CreatePostModalProps) {
  const [postType, setPostType] = useState<"offering" | "seeking">("offering");
  const [location, setLocation] = useState("");
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>(
    defaultCommunityId ? [defaultCommunityId] : []
  );
  const [customizePerCommunity, setCustomizePerCommunity] = useState(false);
  const [sharedContent, setSharedContent] = useState<CommunityContent>(emptyContent());
  const [communityContent, setCommunityContent] = useState<Record<string, CommunityContent>>({});
  const [activeCommunityTab, setActiveCommunityTab] = useState<string>("");
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const communityDropdownRef = useRef<HTMLDivElement>(null);
  const [isInPerson, setIsInPerson] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mediaCount, setMediaCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setPostType("offering");
      setLocation("");
      setIsInPerson(true);
      setIsOnline(false);
      setSelectedCommunities(defaultCommunityId ? [defaultCommunityId] : []);
      setCustomizePerCommunity(false);
      setSharedContent(emptyContent());
      setCommunityContent({});
      setActiveCommunityTab(defaultCommunityId || "");
      setSubmitted(false);
      setMediaCount(0);
      setShowPreview(false);
    }
  }, [isOpen, defaultCommunityId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close community dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (communityDropdownRef.current && !communityDropdownRef.current.contains(e.target as Node)) {
        setCommunityDropdownOpen(false);
      }
    };
    if (communityDropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [communityDropdownOpen]);

  // Sync active tab when communities change
  useEffect(() => {
    if (customizePerCommunity && selectedCommunities.length > 0) {
      if (!selectedCommunities.includes(activeCommunityTab)) {
        setActiveCommunityTab(selectedCommunities[0]);
      }
    }
  }, [selectedCommunities, customizePerCommunity]);

  const toggleCommunity = (id: string) => {
    setSelectedCommunities(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(c => c !== id);
        if (activeCommunityTab === id && next.length > 0) setActiveCommunityTab(next[0]);
        return next;
      }
      const next = [...prev, id];
      if (!activeCommunityTab) setActiveCommunityTab(id);
      return next;
    });
  };

  const handleCustomizeToggle = (value: boolean) => {
    setCustomizePerCommunity(value);
    if (value) {
      // Seed per-community content from shared
      const seed: Record<string, CommunityContent> = {};
      selectedCommunities.forEach(id => {
        seed[id] = communityContent[id] || { ...sharedContent };
      });
      setCommunityContent(seed);
      if (selectedCommunities.length > 0) setActiveCommunityTab(selectedCommunities[0]);
    }
  };

  const updateCommunityContent = (id: string, field: keyof CommunityContent, value: string) => {
    setCommunityContent(prev => ({
      ...prev,
      [id]: { ...(prev[id] || emptyContent()), [field]: value },
    }));
  };

  const getContent = (id: string): CommunityContent =>
    customizePerCommunity ? (communityContent[id] || emptyContent()) : sharedContent;

  const isFormValid = () => {
    if (selectedCommunities.length === 0) return false;
    if (!isInPerson && !isOnline) return false;
    if (isInPerson && !location.trim()) return false;
    if (customizePerCommunity) {
      return selectedCommunities.every(id => {
        const c = communityContent[id] || emptyContent();
        return c.serviceTitle.trim() && c.category && c.description.trim();
      });
    }
    return sharedContent.serviceTitle.trim() && sharedContent.category && sharedContent.description.trim();
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;
    setSubmitted(true);
  };

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

          {/* Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 top-0 z-50 flex flex-col bg-neutral-50 overflow-hidden md:top-4 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-[680px] md:rounded-2xl md:shadow-2xl"
          >
            {submitted ? (
              /* Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check size={36} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Post Submitted!</h2>
                <p className="text-neutral-600 mb-2">
                  Your post has been submitted to {selectedCommunities.length} {selectedCommunities.length === 1 ? "community" : "communities"} for review.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {selectedCommunities.map(id => {
                    const c = allCommunities.find(c => c.id === id);
                    if (!c) return null;
                    return (
                      <span key={id} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full text-sm font-medium text-neutral-700">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${c.color}`} />
                        {c.name}
                      </span>
                    );
                  })}
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {showPreview && (
                      <button
                        onClick={() => setShowPreview(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors mr-1"
                      >
                        <ArrowLeft size={18} className="text-neutral-600" />
                      </button>
                    )}
                    <h2 className="text-lg font-bold text-neutral-900">
                      {showPreview ? "Post Preview" : "Create Post"}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <X size={18} className="text-neutral-600" />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto">
                  {showPreview ? (
                    /* ── Preview Card ── */
                    (() => {
                      const previewContent = sharedContent;
                      const firstCommunity = allCommunities.find(c => c.id === selectedCommunities[0]);
                      const locationLabel = isInPerson && isOnline
                        ? `${location || "Your City"} · Online`
                        : isOnline
                        ? "Online / Remote"
                        : location || "Your City";
                      return (
                        <div className="p-6">
                          <p className="text-xs text-neutral-400 mb-4 text-center">This is how your post will appear in the feed</p>
                          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
                            {/* Post Header */}
                            <div className="p-5 pb-3">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                  JD
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-semibold text-neutral-900 text-sm">John Doe</span>
                                    <span className="text-neutral-400 text-xs">in</span>
                                    {firstCommunity ? (
                                      <div className="flex items-center gap-1">
                                        <div className={`w-4 h-4 rounded-[4px] bg-gradient-to-br ${firstCommunity.color} flex items-center justify-center`}>
                                          <Users size={9} className="text-white" />
                                        </div>
                                        <span className="text-xs font-medium text-neutral-700">{firstCommunity.name}</span>
                                        {selectedCommunities.length > 1 && (
                                          <span className="text-xs text-neutral-400">+{selectedCommunities.length - 1} more</span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-neutral-400 italic">No community selected</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-0.5">
                                    <MapPin size={11} />
                                    <span>{locationLabel}</span>
                                    <span>·</span>
                                    <span>Just now</span>
                                  </div>
                                </div>
                              </div>

                              {/* Badges */}
                              <div className="flex items-center gap-2 flex-wrap mb-3">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${
                                  postType === "offering" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                  {postType === "offering" ? "Offering Service" : "Seeking Service"}
                                </span>
                                {previewContent.category && (
                                  <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-md">
                                    {previewContent.category}
                                  </span>
                                )}
                                {isOnline && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-md">
                                    <Wifi size={10} /> Online
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h2 className="text-lg font-bold text-neutral-900 mb-1.5 flex items-center gap-2">
                                <TrendingUp size={18} className="text-neutral-600 flex-shrink-0" />
                                <span>{previewContent.serviceTitle || <span className="text-neutral-300 italic font-normal text-base">Service title will appear here</span>}</span>
                              </h2>

                              {/* Description */}
                              <p className="text-sm text-neutral-600 leading-relaxed">
                                {previewContent.description || <span className="text-neutral-300 italic">Description will appear here…</span>}
                              </p>

                              {/* Price */}
                              {(previewContent.price || previewContent.priceType) && (
                                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-sm font-semibold">
                                  {previewContent.price ? `$${Number(previewContent.price).toLocaleString()}` : ""}
                                  {previewContent.priceType && (
                                    <span className="font-normal text-neutral-300 text-xs">{previewContent.priceType}</span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Media placeholder */}
                            {mediaCount > 0 && (
                              <div className="mx-5 mb-4 h-40 bg-neutral-100 rounded-xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-200">
                                <Image size={24} className="text-neutral-300" />
                                <span className="text-xs text-neutral-400">{mediaCount} photo{mediaCount > 1 ? "s" : ""} attached</span>
                              </div>
                            )}

                            {/* Action bar */}
                            <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-neutral-300 text-sm">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                                  <span>0</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-neutral-300 text-sm">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                  <span>0</span>
                                </div>
                              </div>
                              <span className="text-xs text-neutral-300">Share</span>
                            </div>
                          </div>

                          {/* Empty field warnings */}
                          {(!previewContent.serviceTitle || !previewContent.description || !previewContent.category) && (
                            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                              <p className="text-xs font-medium text-amber-700 mb-1">Missing fields</p>
                              <ul className="text-xs text-amber-600 space-y-0.5">
                                {!previewContent.serviceTitle && <li>· Service title</li>}
                                {!previewContent.category && <li>· Category</li>}
                                {!previewContent.description && <li>· Description</li>}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })()
                  ) : (
                  <div className="p-6 space-y-8">

                    {/* Section 1: Post Type */}
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">What are you doing?</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPostType("offering")}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            postType === "offering"
                              ? "border-green-500 bg-green-50"
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          }`}
                        >
                          <div className={`text-sm font-bold mb-1 ${postType === "offering" ? "text-green-700" : "text-neutral-900"}`}>
                            Offering a Service
                          </div>
                          <div className="text-xs text-neutral-500">I have something to provide</div>
                        </button>
                        <button
                          onClick={() => setPostType("seeking")}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            postType === "seeking"
                              ? "border-blue-500 bg-blue-50"
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          }`}
                        >
                          <div className={`text-sm font-bold mb-1 ${postType === "seeking" ? "text-blue-700" : "text-neutral-900"}`}>
                            Seeking a Service
                          </div>
                          <div className="text-xs text-neutral-500">I need something done</div>
                        </button>
                      </div>
                    </section>

                    {/* Section 2: Communities */}
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-1">Post to Communities</h3>
                      <p className="text-xs text-neutral-400 mb-3">Select one or more communities to post in</p>

                      {/* Dropdown trigger */}
                      <div className="relative" ref={communityDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setCommunityDropdownOpen(v => !v)}
                          className={`w-full flex items-center gap-2 px-3 py-3 bg-white border-2 rounded-xl transition-colors text-sm ${
                            communityDropdownOpen ? "border-neutral-900" : "border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <Users size={15} className="text-neutral-400 flex-shrink-0" />
                          <span className="flex-1 text-left text-neutral-500">
                            {selectedCommunities.length === 0
                              ? "Choose communities…"
                              : `${selectedCommunities.length} communit${selectedCommunities.length === 1 ? "y" : "ies"} selected`}
                          </span>
                          {communityDropdownOpen
                            ? <ChevronUp size={15} className="text-neutral-400 flex-shrink-0" />
                            : <ChevronDown size={15} className="text-neutral-400 flex-shrink-0" />}
                        </button>

                        {/* Dropdown panel */}
                        <AnimatePresence>
                          {communityDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15 }}
                              className="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden"
                            >
                              {allCommunities.map(community => {
                                const selected = selectedCommunities.includes(community.id);
                                return (
                                  <button
                                    key={community.id}
                                    type="button"
                                    onClick={() => toggleCommunity(community.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors text-left ${
                                      selected ? "bg-neutral-50" : "hover:bg-neutral-50"
                                    }`}
                                  >
                                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${community.color} flex items-center justify-center flex-shrink-0`}>
                                      <Users className="text-white" size={14} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold text-neutral-900">{community.name}</div>
                                      <div className="text-xs text-neutral-400">{community.category}</div>
                                    </div>
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                      selected ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                                    }`}>
                                      {selected && <Check size={11} className="text-white" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Selected community chips */}
                      {selectedCommunities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedCommunities.map(id => {
                            const c = allCommunities.find(c => c.id === id);
                            if (!c) return null;
                            return (
                              <span key={id} className="flex items-center gap-1.5 pl-2 pr-1 py-1 bg-white border border-neutral-200 rounded-full text-xs font-medium text-neutral-700">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${c.color}`} />
                                {c.name}
                                <button
                                  type="button"
                                  onClick={() => toggleCommunity(id)}
                                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                                >
                                  <X size={10} className="text-neutral-500" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {selectedCommunities.length === 0 && (
                        <p className="text-xs text-red-500 mt-2">Please select at least one community</p>
                      )}
                    </section>

                    {/* Section 3: Location */}
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-1">Location</h3>
                      <p className="text-xs text-neutral-400 mb-3">Required for in-person services — used in search filtering</p>

                      {/* Independent toggles — both can be active */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          onClick={() => setIsInPerson(v => !v)}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            isInPerson
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                          }`}
                        >
                          <MapPin size={15} />
                          In-Person
                          {isInPerson && <Check size={13} />}
                        </button>
                        <button
                          onClick={() => { setIsOnline(v => !v); if (isOnline) setLocation(""); }}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            isOnline
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                          }`}
                        >
                          <Wifi size={15} />
                          Online / Remote
                          {isOnline && <Check size={13} />}
                        </button>
                      </div>

                      {/* Mode summary badge */}
                      {isInPerson && isOnline && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 px-3 py-2 mb-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-700 font-medium"
                        >
                          <MapPin size={13} />
                          <Wifi size={13} />
                          <span>Available both in-person and online</span>
                        </motion.div>
                      )}

                      {!isInPerson && !isOnline && (
                        <p className="text-xs text-red-500 mb-3">Please select at least one option</p>
                      )}

                      {/* Location input — shown only when in-person is selected */}
                      <AnimatePresence>
                        {isInPerson && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="relative">
                              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                              <input
                                type="text"
                                placeholder="City, State (e.g. San Francisco, CA)"
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className={`w-full pl-9 pr-4 py-3 bg-white border-2 rounded-xl focus:outline-none transition-colors text-sm ${
                                  location.trim()
                                    ? "border-neutral-900 focus:border-neutral-900"
                                    : "border-neutral-200 focus:border-neutral-900"
                                }`}
                              />
                            </div>
                            {!location.trim() && (
                              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-amber-500 inline-block" />
                                Required for in-person services
                              </p>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Online-only note */}
                      {isOnline && !isInPerson && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700"
                        >
                          <Wifi size={14} />
                          <span>Online only — no location needed</span>
                        </motion.div>
                      )}
                    </section>

                    {/* Section 4: Service Details */}
                    {selectedCommunities.length > 0 && (
                      <section>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide">Service Details</h3>
                            {selectedCommunities.length > 1 && (
                              <p className="text-xs text-neutral-400 mt-0.5">
                                {customizePerCommunity
                                  ? "Each community gets different content"
                                  : "Same content posted to all communities"}
                              </p>
                            )}
                          </div>

                          {/* Customize toggle — only shown when multiple communities are selected */}
                          {selectedCommunities.length > 1 && (
                            <button
                              onClick={() => handleCustomizeToggle(!customizePerCommunity)}
                              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                                customizePerCommunity
                                  ? "bg-neutral-900 text-white border-neutral-900"
                                  : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500"
                              }`}
                            >
                              {customizePerCommunity ? "Customized" : "Customize per community"}
                            </button>
                          )}
                        </div>

                        {customizePerCommunity ? (
                          /* Per-community tabs */
                          <div>
                            {/* Tab bar */}
                            <div className="flex gap-1 overflow-x-auto pb-1 mb-4 scrollbar-hide">
                              {selectedCommunities.map(id => {
                                const c = allCommunities.find(c => c.id === id);
                                if (!c) return null;
                                const content = communityContent[id] || emptyContent();
                                const hasContent = content.serviceTitle.trim() && content.category && content.description.trim();
                                return (
                                  <button
                                    key={id}
                                    onClick={() => setActiveCommunityTab(id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 border ${
                                      activeCommunityTab === id
                                        ? "bg-white border-neutral-900 text-neutral-900 shadow-sm"
                                        : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400"
                                    }`}
                                  >
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${c.color}`} />
                                    {c.name.split(" ")[0]}
                                    {hasContent && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Active tab form */}
                            {activeCommunityTab && (() => {
                              const community = allCommunities.find(c => c.id === activeCommunityTab);
                              const content = communityContent[activeCommunityTab] || emptyContent();
                              return (
                                <div className="space-y-4">
                                  {community && (
                                    <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-neutral-200">
                                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${community.color} flex items-center justify-center`}>
                                        <Users size={14} className="text-white" />
                                      </div>
                                      <span className="text-sm font-semibold text-neutral-800">{community.name}</span>
                                    </div>
                                  )}
                                  <ContentFields
                                    content={content}
                                    postType={postType}
                                    onUpdate={(field, value) => updateCommunityContent(activeCommunityTab, field, value)}
                                  />
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          /* Single shared form */
                          <ContentFields
                            content={sharedContent}
                            postType={postType}
                            onUpdate={(field, value) => setSharedContent(prev => ({ ...prev, [field]: value }))}
                          />
                        )}
                      </section>
                    )}

                    {/* Section 5: Media */}
                    <section>
                      <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3">Media (Optional)</h3>
                      <div className="space-y-2">
                        {Array.from({ length: mediaCount }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white border-2 border-dashed border-neutral-300 rounded-xl">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Image size={16} className="text-neutral-400" />
                            </div>
                            <span className="text-sm text-neutral-400 flex-1">Image/Video {i + 1}</span>
                            <button
                              onClick={() => setMediaCount(c => c - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => setMediaCount(c => Math.min(c + 1, 5))}
                          disabled={mediaCount >= 5}
                          className="w-full flex items-center justify-center gap-2 p-3 bg-white border-2 border-dashed border-neutral-300 rounded-xl text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                          Add Photo / Video {mediaCount > 0 ? `(${mediaCount}/5)` : ""}
                        </button>
                      </div>
                    </section>

                    {/* Bottom padding for sticky button */}
                    <div className="h-4" />
                  </div>
                  )}
                </div>

                {/* Sticky Footer */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-neutral-200">
                  {/* Summary pills — only on form view */}
                  {!showPreview && selectedCommunities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {selectedCommunities.map(id => {
                        const c = allCommunities.find(c => c.id === id);
                        if (!c) return null;
                        return (
                          <span key={id} className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-full text-xs text-neutral-600">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${c.color}`} />
                            {c.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {/* Preview / Back button */}
                    <button
                      onClick={() => setShowPreview(v => !v)}
                      className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm border-2 border-neutral-200 text-neutral-700 hover:border-neutral-400 transition-all flex-shrink-0"
                    >
                      {showPreview ? (
                        <><ArrowLeft size={15} /> Edit</>
                      ) : (
                        <><Eye size={15} /> Preview</>
                      )}
                    </button>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={!isFormValid()}
                      className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                        isFormValid()
                          ? "bg-neutral-900 text-white hover:bg-neutral-800 active:scale-[0.98]"
                          : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                    >
                      {selectedCommunities.length === 0
                        ? "Select communities to continue"
                        : `Submit to ${selectedCommunities.length} ${selectedCommunities.length === 1 ? "Community" : "Communities"}`}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface ContentFieldsProps {
  content: CommunityContent;
  postType: "offering" | "seeking";
  onUpdate: (field: keyof CommunityContent, value: string) => void;
}

function ContentFields({ content, postType, onUpdate }: ContentFieldsProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [rateTypeOpen, setRateTypeOpen] = useState(false);
  const rateTypes = postType === "offering" ? offeringRateTypes : seekingRateTypes;
  const isOffering = postType === "offering";

  return (
    <div className="space-y-4">
      {/* Service Title */}
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">
          {isOffering ? "Service Title" : "What are you looking for?"}
        </label>
        <input
          type="text"
          placeholder={isOffering ? "e.g. Custom Logo Design, Rideshare to Airport…" : "e.g. Logo designer, Moving help…"}
          value={content.serviceTitle}
          onChange={e => onUpdate("serviceTitle", e.target.value)}
          className="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors text-sm"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Category</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setCategoryOpen(o => !o)}
            className={`w-full flex items-center justify-between px-4 py-3 bg-white border-2 rounded-xl text-sm transition-colors ${
              content.category ? "border-neutral-900 text-neutral-900" : "border-neutral-200 text-neutral-400"
            }`}
          >
            <span>{content.category || "Select a category"}</span>
            {categoryOpen ? <ChevronUp size={16} className="text-neutral-500" /> : <ChevronDown size={16} className="text-neutral-500" />}
          </button>
          <AnimatePresence>
            {categoryOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute z-10 top-full mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="max-h-48 overflow-y-auto py-1">
                  {categoryOptions.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => { onUpdate("category", cat); setCategoryOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                        content.category === cat ? "text-neutral-900 font-medium" : "text-neutral-700"
                      }`}
                    >
                      {cat}
                      {content.category === cat && <Check size={14} className="text-neutral-900" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Pricing / Budget */}
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">
          {isOffering ? "Pricing" : "Budget"}
          <span className="ml-1 font-normal text-neutral-400">(optional)</span>
        </label>

        {isOffering ? (
          /* Offering: plain $ input + rate type side by side */
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium select-none">$</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={content.price}
                  onChange={e => onUpdate("price", e.target.value)}
                  className="w-full pl-7 pr-3 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div className="relative w-40 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setRateTypeOpen(o => !o)}
                  className={`w-full flex items-center justify-between px-3 py-3 bg-white border-2 rounded-xl text-sm transition-colors ${
                    content.priceType ? "border-neutral-900 text-neutral-900" : "border-neutral-200 text-neutral-400"
                  }`}
                >
                  <span className="truncate">{content.priceType || "Rate type"}</span>
                  {rateTypeOpen ? <ChevronUp size={14} className="text-neutral-500 flex-shrink-0 ml-1" /> : <ChevronDown size={14} className="text-neutral-500 flex-shrink-0 ml-1" />}
                </button>
                <AnimatePresence>
                  {rateTypeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute z-10 top-full right-0 mt-1 w-44 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="py-1">
                        {rateTypes.map(rt => (
                          <button
                            key={rt}
                            type="button"
                            onClick={() => { onUpdate("priceType", rt); setRateTypeOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                              content.priceType === rt ? "text-neutral-900 font-medium" : "text-neutral-700"
                            }`}
                          >
                            {rt}
                            {content.priceType === rt && <Check size={13} className="text-neutral-900" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-1.5">Community pricing data helps seekers calibrate their budget</p>
          </>
        ) : (
          /* Seeking: gradient budget meter + rate type below */
          (() => {
            const pricing = communityPricing[content.category] || defaultPricing;
            const sliderMin = pricing.low;
            const sliderMax = pricing.high;
            const currentVal = content.price !== "" ? Math.min(Math.max(Number(content.price), sliderMin), sliderMax) : pricing.median;
            const pct = ((currentVal - sliderMin) / (sliderMax - sliderMin)) * 100;
            const medianPct = ((pricing.median - sliderMin) / (sliderMax - sliderMin)) * 100;

            return (
              <div className="space-y-3">
                {/* Meter container */}
                <div className="bg-white border-2 border-neutral-200 rounded-xl p-4">

                  {/* Value bubble + slider track wrapper */}
                  <div className="relative mb-5">
                    {/* Floating value bubble */}
                    <div
                      className="absolute -top-1 flex flex-col items-center pointer-events-none"
                      style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
                    >
                      <div className="bg-neutral-900 text-white text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap shadow-md">
                        ${currentVal.toLocaleString()}
                      </div>
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-neutral-900 mt-0" />
                    </div>

                    {/* Spacer for bubble height */}
                    <div className="h-8" />

                    {/* Gradient track + slider */}
                    <div className="relative h-3">
                      {/* Single full-width gradient bar */}
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: "linear-gradient(to right, #eab308, #22c55e, #f97316)" }}
                      />
                      {/* Grey mask over unselected right portion */}
                      <div
                        className="absolute top-0 right-0 bottom-0 rounded-r-full bg-neutral-200/80"
                        style={{ width: `${100 - pct}%` }}
                      />
                      {/* Range input */}
                      <input
                        type="range"
                        min={sliderMin}
                        max={sliderMax}
                        step={5}
                        value={currentVal}
                        onChange={e => onUpdate("price", e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      {/* Thumb indicator */}
                      <div
                        className="absolute top-1/2 w-5 h-5 rounded-full bg-white border-2 border-neutral-800 shadow-md pointer-events-none"
                        style={{ left: `${pct}%`, transform: "translate(-50%, -50%)" }}
                      />
                    </div>

                    {/* Median marker */}
                    <div
                      className="absolute top-8 flex flex-col items-center pointer-events-none"
                      style={{ left: `${medianPct}%`, transform: "translateX(-50%)" }}
                    >
                      <div className="w-px h-2 bg-neutral-400" />
                    </div>
                  </div>

                  {/* Range labels */}
                  <div className="flex justify-between items-end mt-1">
                    <div className="text-center">
                      <div className="text-xs font-semibold text-emerald-600">${pricing.low}</div>
                      <div className="text-[10px] text-neutral-400">Low</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-amber-500">${pricing.median}</div>
                      <div className="text-[10px] text-neutral-400">Median</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-red-500">${pricing.high}</div>
                      <div className="text-[10px] text-neutral-400">High</div>
                    </div>
                  </div>

                  {content.category ? (
                    <p className="text-[10px] text-neutral-400 mt-3 text-center">
                      Based on community rates in <span className="font-medium text-neutral-600">{content.category}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-neutral-400 mt-3 text-center">Select a category above to see community rates</p>
                  )}
                </div>

                {/* Rate type row */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRateTypeOpen(o => !o)}
                    className={`w-full flex items-center justify-between px-3 py-3 bg-white border-2 rounded-xl text-sm transition-colors ${
                      content.priceType ? "border-neutral-900 text-neutral-900" : "border-neutral-200 text-neutral-400"
                    }`}
                  >
                    <span className="truncate">{content.priceType || "Rate type (e.g. per hour, total budget)"}</span>
                    {rateTypeOpen ? <ChevronUp size={14} className="text-neutral-500 flex-shrink-0 ml-1" /> : <ChevronDown size={14} className="text-neutral-500 flex-shrink-0 ml-1" />}
                  </button>
                  <AnimatePresence>
                    {rateTypeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute z-10 top-full left-0 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden"
                      >
                        <div className="py-1">
                          {rateTypes.map(rt => (
                            <button
                              key={rt}
                              type="button"
                              onClick={() => { onUpdate("priceType", rt); setRateTypeOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                                content.priceType === rt ? "text-neutral-900 font-medium" : "text-neutral-700"
                              }`}
                            >
                              {rt}
                              {content.priceType === rt && <Check size={13} className="text-neutral-900" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })()
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Description</label>
        <textarea
          placeholder="Describe what you're offering or looking for…"
          value={content.description}
          onChange={e => onUpdate("description", e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-900 transition-colors text-sm resize-none"
        />
        <div className="text-right text-xs text-neutral-400 mt-1">{content.description.length}/500</div>
      </div>
    </div>
  );
}
