import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Users, Check, Image, MapPin, ChevronDown, ChevronUp, Plus, Trash2, Wifi } from "lucide-react";

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
});

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
  const [isInPerson, setIsInPerson] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mediaCount, setMediaCount] = useState(0);

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
    }
  }, [isOpen, defaultCommunityId]);

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
            className="fixed inset-0 bg-black/50 z-50"
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
                  <h2 className="text-lg font-bold text-neutral-900">Create Post</h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                  >
                    <X size={18} className="text-neutral-600" />
                  </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto">
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
                      <div className="space-y-2">
                        {allCommunities.map(community => {
                          const selected = selectedCommunities.includes(community.id);
                          return (
                            <button
                              key={community.id}
                              onClick={() => toggleCommunity(community.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                                selected
                                  ? "border-neutral-900 bg-white"
                                  : "border-neutral-200 bg-white hover:border-neutral-300"
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${community.color} flex items-center justify-center flex-shrink-0`}>
                                <Users className="text-white" size={18} />
                              </div>
                              <div className="flex-1 text-left">
                                <div className="text-sm font-semibold text-neutral-900">{community.name}</div>
                                <div className="text-xs text-neutral-500">{community.category}</div>
                              </div>
                              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                selected ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                              }`}>
                                {selected && <Check size={12} className="text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
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
                </div>

                {/* Sticky Submit */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-neutral-200">
                  {/* Summary pill */}
                  {selectedCommunities.length > 0 && (
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
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
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
  onUpdate: (field: keyof CommunityContent, value: string) => void;
}

function ContentFields({ content, onUpdate }: ContentFieldsProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Service Title */}
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Service Title</label>
        <input
          type="text"
          placeholder="e.g. Custom Logo Design, Rideshare to Airport…"
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
