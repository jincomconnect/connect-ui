import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Globe, Lock, UserCheck, ChevronRight, ChevronLeft,
  Check, Tag, Palette, AlertCircle, Hash, MessageSquare,
  UserPlus, BookOpen, Calendar, Share2, Pin, Eye, Megaphone, ArrowLeft
} from "lucide-react";
import "./CreateCommunity.css";

const CATEGORIES = [
  "Design", "Technology", "Marketing", "Photography", "Health & Wellness",
  "Education", "Finance", "Food & Beverage", "Creative", "Consulting",
  "Legal", "Real Estate", "Sports & Fitness", "Music",
  "Religious & Cultural", "Other",
];

interface Theme {
  id: string;
  label: string;
  description: string;
  preview: React.ReactNode;
}

const THEMES: Theme[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Single feed, card posts",
    preview: (
      <div className="w-full h-full flex flex-col gap-1 p-1.5">
        <div className="h-1.5 w-3/4 bg-current rounded-full opacity-40" />
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-4 w-full bg-current rounded opacity-20" />
          <div className="h-4 w-full bg-current rounded opacity-20" />
          <div className="h-4 w-5/6 bg-current rounded opacity-20" />
        </div>
      </div>
    ),
  },
  {
    id: "magazine",
    label: "Magazine",
    description: "Featured hero + article grid",
    preview: (
      <div className="w-full h-full flex flex-col gap-1 p-1.5">
        <div className="h-5 w-full bg-current rounded opacity-30" />
        <div className="flex gap-1 flex-1">
          <div className="flex-1 bg-current rounded opacity-20" />
          <div className="w-1/3 flex flex-col gap-1">
            <div className="flex-1 bg-current rounded opacity-20" />
            <div className="flex-1 bg-current rounded opacity-20" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "grid",
    label: "Grid",
    description: "Photo & card grid layout",
    preview: (
      <div className="w-full h-full grid grid-cols-3 gap-1 p-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-current rounded opacity-20" />
        ))}
      </div>
    ),
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Text-first, distraction-free",
    preview: (
      <div className="w-full h-full flex flex-col gap-1.5 p-1.5 justify-center">
        <div className="h-1 w-1/2 bg-current rounded-full opacity-50 mx-auto" />
        <div className="h-1 w-full bg-current rounded-full opacity-20" />
        <div className="h-1 w-full bg-current rounded-full opacity-20" />
        <div className="h-1 w-3/4 bg-current rounded-full opacity-20" />
      </div>
    ),
  },
  {
    id: "board",
    label: "Board",
    description: "Columns organised by topic",
    preview: (
      <div className="w-full h-full flex gap-1 p-1.5">
        {[3, 2, 3].map((rows, col) => (
          <div key={col} className="flex-1 flex flex-col gap-1">
            <div className="h-1.5 w-full bg-current rounded-full opacity-50" />
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex-1 bg-current rounded opacity-20" />
            ))}
          </div>
        ))}
      </div>
    ),
  },
];

const ACCENT_COLORS = [
  { label: "Indigo",   from: "from-indigo-500",  to: "to-purple-500",  preview: "bg-indigo-500" },
  { label: "Sky",      from: "from-sky-500",      to: "to-cyan-500",    preview: "bg-sky-500" },
  { label: "Emerald",  from: "from-emerald-500",  to: "to-teal-500",    preview: "bg-emerald-500" },
  { label: "Rose",     from: "from-rose-500",     to: "to-pink-500",    preview: "bg-rose-500" },
  { label: "Amber",    from: "from-amber-500",    to: "to-orange-500",  preview: "bg-amber-500" },
  { label: "Violet",   from: "from-violet-500",   to: "to-fuchsia-500", preview: "bg-violet-500" },
  { label: "Slate",    from: "from-slate-700",    to: "to-slate-500",   preview: "bg-slate-600" },
  { label: "Lime",     from: "from-lime-500",     to: "to-green-500",   preview: "bg-lime-500" },
];

interface Permission {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultOn: boolean;
}

const PERMISSIONS: Permission[] = [
  { id: "post",    label: "Post content",         description: "Members can create posts and share services",     icon: <Megaphone size={16} />, defaultOn: true },
  { id: "comment", label: "Comment on posts",     description: "Members can reply and engage with content",       icon: <MessageSquare size={16} />, defaultOn: true },
  { id: "invite",  label: "Invite new members",   description: "Members can send invitations to others",          icon: <UserPlus size={16} />, defaultOn: false },
  { id: "members", label: "View member directory",description: "Members can browse the full list of members",     icon: <Eye size={16} />, defaultOn: true },
  { id: "events",  label: "Create events",        description: "Members can schedule and host community events",  icon: <Calendar size={16} />, defaultOn: false },
  { id: "share",   label: "Share posts externally",description: "Members can share posts outside the community",  icon: <Share2 size={16} />, defaultOn: true },
  { id: "pin",     label: "Pin posts",            description: "Members can pin important posts to the top",      icon: <Pin size={16} />, defaultOn: false },
  { id: "wiki",    label: "Edit community wiki",  description: "Members can contribute to the community wiki",    icon: <BookOpen size={16} />, defaultOn: false },
];

const STEPS = ["Basics", "Access", "Permissions", "Review"];

type Privacy = "public" | "private" | "invite";

interface FormData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  tagInput: string;
  color: number;
  theme: number;
  privacy: Privacy;
  maxMembers: number | "";
  permissions: Record<string, boolean>;
}

const initialPermissions = Object.fromEntries(
  PERMISSIONS.map(p => [p.id, p.defaultOn])
);

export function CreateCommunity() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    tags: [],
    tagInput: "",
    color: 0,
    theme: 0,
    privacy: "public",
    maxMembers: 500,
    permissions: initialPermissions,
  });

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // Step validation
  const step0Valid = form.name.trim().length >= 3 && form.category !== "";
  const step1Valid = form.privacy !== undefined;
  const step2Valid = true;

  const canNext = [step0Valid, step1Valid, step2Valid, true][step];

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && form.tagInput.trim()) {
      e.preventDefault();
      const tag = form.tagInput.trim().replace(/,/g, "").toLowerCase();
      if (tag && form.tags.length < 8 && !form.tags.includes(tag)) {
        set("tags", [...form.tags, tag]);
      }
      set("tagInput", "");
    }
    if (e.key === "Backspace" && !form.tagInput && form.tags.length) {
      set("tags", form.tags.slice(0, -1));
    }
  };

  const removeTag = (t: string) => set("tags", form.tags.filter(x => x !== t));

  const togglePermission = (id: string) =>
    set("permissions", { ...form.permissions, [id]: !form.permissions[id] });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const color = ACCENT_COLORS[form.color];

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <div className={`inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br ${color.from} ${color.to} items-center justify-center mb-6 shadow-lg`}>
            <Check size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Community created!</h1>
          <p className="text-neutral-500 text-sm mb-2">
            <span className="font-semibold text-neutral-700">"{form.name}"</span> is ready. You're now the creator and admin.
          </p>
          <p className="text-neutral-400 text-xs mb-8">In a real app, this would be saved to your database.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate("/communities")}
              className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Browse communities
            </button>
            <button
              onClick={() => { setSubmitted(false); setStep(0); setForm({ name: "", description: "", category: "", tags: [], tagInput: "", color: 0, theme: 0, privacy: "public", maxMembers: 500, permissions: initialPermissions }); }}
              className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${color.from} ${color.to} rounded-lg hover:opacity-90 transition-opacity`}
            >
              Create another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-neutral-500 hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Create a community</h1>
            <p className="text-sm text-neutral-500 mt-0.5">Build a space for people who share your interests</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  i < step ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step
                    ? `bg-gradient-to-br ${color.from} ${color.to} text-white`
                    : i === step
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-200 text-neutral-400"
                }`}>
                  {i < step ? <Check size={13} strokeWidth={3} /> : i + 1}
                </div>
                <span className={i === step ? "text-neutral-900" : i < step ? "text-neutral-600" : "text-neutral-400"}>
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-3 transition-colors ${i < step ? "bg-neutral-400" : "bg-neutral-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step card */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.18 }}
              className="p-8"
            >
              {/* ── STEP 0: Basics ─────────────────────────── */}
              {step === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-1">Basic information</h2>
                    <p className="text-sm text-neutral-500">Give your community an identity</p>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Community name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => set("name", e.target.value)}
                      maxLength={60}
                      placeholder="e.g. Freelance Designers SF"
                      className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                    <div className="flex items-center justify-between mt-1">
                      {form.name.trim().length > 0 && form.name.trim().length < 3 && (
                        <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle size={11} /> At least 3 characters</p>
                      )}
                      <p className="text-xs text-neutral-400 ml-auto">{form.name.length}/60</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => set("description", e.target.value)}
                      maxLength={300}
                      rows={3}
                      placeholder="What is this community about? Who should join?"
                      className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
                    />
                    <p className="text-xs text-neutral-400 text-right mt-1">{form.description.length}/300</p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => set("category", cat)}
                          className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all text-left ${
                            form.category === cat
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Tags <span className="text-neutral-400 font-normal">(optional, up to 8)</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-2.5 border border-neutral-200 rounded-lg min-h-[44px] focus-within:ring-2 focus-within:ring-neutral-900 focus-within:border-transparent transition-all">
                      {form.tags.map(t => (
                        <span key={t} className="flex items-center gap-1 bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded-md font-medium">
                          <Hash size={10} />
                          {t}
                          <button onClick={() => removeTag(t)} className="ml-0.5 hover:text-red-500 transition-colors">×</button>
                        </span>
                      ))}
                      {form.tags.length < 8 && (
                        <input
                          type="text"
                          value={form.tagInput}
                          onChange={e => set("tagInput", e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder={form.tags.length === 0 ? "Type a tag and press Enter…" : ""}
                          className="flex-1 min-w-[120px] text-xs outline-none bg-transparent"
                        />
                      )}
                    </div>
                  </div>

                  {/* Color accent */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Palette size={14} className="inline mr-1.5 mb-0.5" />
                      Color accent
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {ACCENT_COLORS.map((c, i) => (
                        <button
                          key={c.label}
                          type="button"
                          onClick={() => set("color", i)}
                          title={c.label}
                          className={`w-8 h-8 rounded-full ${c.preview} transition-all flex items-center justify-center ${
                            form.color === i ? "ring-2 ring-offset-2 ring-neutral-900 scale-110" : "hover:scale-105"
                          }`}
                        >
                          {form.color === i && <Check size={13} className="text-white" strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                    {/* Live preview */}
                    <div className={`mt-3 h-12 rounded-xl bg-gradient-to-r ${color.from} ${color.to} flex items-center px-4 gap-3 transition-all`}>
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <Users size={14} className="text-white" />
                      </div>
                      <span className="text-white text-sm font-semibold truncate">{form.name || "Community name preview"}</span>
                    </div>
                  </div>

                  {/* Theme picker */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Layout theme
                    </label>
                    <p className="text-xs text-neutral-400 mb-3">Controls how posts and content are arranged for members</p>
                    <div className="grid grid-cols-5 gap-2">
                      {THEMES.map((theme, i) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => set("theme", i)}
                          className={`flex flex-col items-center gap-2 group transition-all`}
                        >
                          <div className={`w-full aspect-[4/3] rounded-lg border-2 transition-all overflow-hidden ${
                            form.theme === i
                              ? `border-neutral-900 shadow-md`
                              : "border-neutral-200 hover:border-neutral-400"
                          } ${form.theme === i ? `bg-gradient-to-br ${color.from} ${color.to} text-white` : "bg-neutral-100 text-neutral-400"}`}>
                            {theme.preview}
                          </div>
                          <div className="text-center">
                            <p className={`text-xs font-semibold leading-none mb-0.5 ${form.theme === i ? "text-neutral-900" : "text-neutral-500"}`}>
                              {theme.label}
                            </p>
                            <p className="text-[10px] text-neutral-400 leading-tight hidden sm:block">{theme.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 1: Access ──────────────────────────── */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-1">Access & capacity</h2>
                    <p className="text-sm text-neutral-500">Control who can join and how many members you allow</p>
                  </div>

                  {/* Privacy */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Visibility</label>
                    {([
                      { value: "public", Icon: Globe, label: "Public", desc: "Anyone can find and join this community" },
                      { value: "private", Icon: Lock, label: "Private", desc: "Visible to all, but joining requires approval" },
                      { value: "invite", Icon: UserCheck, label: "Invite only", desc: "Hidden from search — members join by invitation" },
                    ] as const).map(({ value, Icon, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("privacy", value)}
                        className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                          form.privacy === value
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-300 bg-white"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          form.privacy === value ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500"
                        }`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-neutral-900">{label}</p>
                            {form.privacy === value && (
                              <div className="w-5 h-5 rounded-full bg-neutral-900 flex items-center justify-center">
                                <Check size={11} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Max members */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-neutral-700">
                        <Users size={14} className="inline mr-1.5 mb-0.5" />
                        Maximum members
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={form.maxMembers}
                          min={2}
                          max={100000}
                          onChange={e => {
                            const v = e.target.value === "" ? "" : Math.max(2, Math.min(100000, Number(e.target.value)));
                            set("maxMembers", v);
                          }}
                          className="w-24 text-right px-2 py-1 border border-neutral-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                        />
                        <span className="text-xs text-neutral-400">members</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={10000}
                      step={10}
                      value={typeof form.maxMembers === "number" ? Math.min(form.maxMembers, 10000) : 2}
                      onChange={e => set("maxMembers", Number(e.target.value))}
                      className="w-full accent-neutral-900"
                    />
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>2</span>
                      <span>Small (50)</span>
                      <span>Medium (500)</span>
                      <span>Large (5k)</span>
                      <span>10k+</span>
                    </div>
                    <p className="mt-3 text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2">
                      You can change this limit at any time from community settings. Set a very high number for no practical cap.
                    </p>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Permissions ─────────────────────── */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-1">Member permissions</h2>
                    <p className="text-sm text-neutral-500">Choose what regular members are allowed to do. Admins can always do everything.</p>
                  </div>

                  <div className="space-y-2">
                    {PERMISSIONS.map(perm => (
                      <button
                        key={perm.id}
                        type="button"
                        onClick={() => togglePermission(perm.id)}
                        className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all text-left ${
                          form.permissions[perm.id]
                            ? "border-neutral-200 bg-white"
                            : "border-neutral-100 bg-neutral-50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          form.permissions[perm.id] ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-400"
                        }`}>
                          {perm.icon}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium transition-colors ${form.permissions[perm.id] ? "text-neutral-900" : "text-neutral-400"}`}>
                            {perm.label}
                          </p>
                          <p className="text-xs text-neutral-400 mt-0.5">{perm.description}</p>
                        </div>
                        <div className={`w-11 h-6 rounded-full flex items-center transition-all flex-shrink-0 ${
                          form.permissions[perm.id] ? "bg-neutral-900 justify-end" : "bg-neutral-200 justify-start"
                        }`}>
                          <div className="w-5 h-5 rounded-full bg-white shadow-sm mx-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-neutral-400 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 flex items-start gap-2">
                    <Tag size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Permissions apply to regular members only. As the creator, you'll always have full admin rights and can adjust these any time.</span>
                  </p>
                </div>
              )}

              {/* ── STEP 3: Review ──────────────────────────── */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 mb-1">Review & create</h2>
                    <p className="text-sm text-neutral-500">Everything look good? You can still go back and edit.</p>
                  </div>

                  {/* Preview card */}
                  <div className="rounded-xl border border-neutral-200 overflow-hidden">
                    <div className={`h-20 bg-gradient-to-r ${color.from} ${color.to} flex items-end px-5 pb-3`}>
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shadow-sm -mb-6 border-2 border-white/30">
                        <Users size={22} className="text-white" />
                      </div>
                    </div>
                    <div className="pt-8 px-5 pb-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-neutral-900 text-lg leading-tight">{form.name}</h3>
                          <p className="text-xs text-neutral-400 mt-0.5">{form.category}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                          form.privacy === "public" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          form.privacy === "private" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          "bg-red-50 text-red-600 border border-red-200"
                        }`}>
                          {form.privacy === "public" ? "Public" : form.privacy === "private" ? "Private" : "Invite only"}
                        </span>
                      </div>
                      {form.description && <p className="text-sm text-neutral-600 mt-2">{form.description}</p>}
                      {form.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {form.tags.map(t => (
                            <span key={t} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">#{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                        <span className="flex items-center gap-1"><Users size={12} /> Up to {typeof form.maxMembers === "number" ? form.maxMembers.toLocaleString() : "—"} members</span>
                      </div>
                    </div>
                  </div>

                  {/* Theme summary */}
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <div>
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">Layout theme</p>
                      <p className="text-sm font-semibold text-neutral-900">{THEMES[form.theme].label}</p>
                      <p className="text-xs text-neutral-400">{THEMES[form.theme].description}</p>
                    </div>
                    <div className={`w-20 h-14 rounded-lg border-2 border-neutral-900 overflow-hidden bg-gradient-to-br ${color.from} ${color.to} text-white flex-shrink-0`}>
                      {THEMES[form.theme].preview}
                    </div>
                  </div>

                  {/* Permissions summary */}
                  <div>
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">Member permissions enabled</p>
                    <div className="flex flex-wrap gap-2">
                      {PERMISSIONS.filter(p => form.permissions[p.id]).map(p => (
                        <span key={p.id} className="flex items-center gap-1.5 text-xs font-medium bg-neutral-100 text-neutral-700 px-2.5 py-1.5 rounded-full">
                          {p.icon}
                          {p.label}
                        </span>
                      ))}
                      {PERMISSIONS.filter(p => form.permissions[p.id]).length === 0 && (
                        <span className="text-xs text-neutral-400">No permissions enabled — members will have read-only access</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer navigation */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-neutral-100 bg-neutral-50/50">
            <button
              onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <ChevronLeft size={16} />
              {step === 0 ? "Cancel" : "Back"}
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all ${
                  canNext
                    ? `bg-gradient-to-r ${color.from} ${color.to} text-white hover:opacity-90 shadow-sm`
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }`}
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r ${color.from} ${color.to} hover:opacity-90 transition-opacity shadow-sm`}
              >
                <Check size={15} strokeWidth={2.5} />
                Create community
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
