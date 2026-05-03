import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Globe, Lock, UserCheck, ChevronRight, ChevronLeft,
  Check, Tag, Palette, AlertCircle, Hash, MessageSquare,
  UserPlus, BookOpen, Calendar, Share2, Pin, Eye, Megaphone, ArrowLeft,
  Copy, Link2, KeyRound, EyeOff
} from "lucide-react";
import "./CreateCommunity.css";

const CATEGORIES = [
  "Design", "Technology", "Marketing", "Photography", "Health & Wellness",
  "Education", "Finance", "Food & Beverage", "Creative", "Consulting",
  "Legal", "Real Estate", "Sports & Fitness", "Music",
  "Religious", "Cultural", "Other",
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

  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [inviteCode, setInviteCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const generateCode = (prefix: string) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const rand = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `${prefix}${rand(4)}`;
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = () => {
    const prefix = form.name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "X").padEnd(4, "X");
    setInviteCode(`${prefix}-${generateCode("")}`);
    if (form.privacy !== "public") setPasscode(generateCode(""));
    setSubmitted(true);
  };

  const color = ACCENT_COLORS[form.color];

  const INTEGRATIONS = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      tagline: "Share via group or broadcast",
      description: "Let members join through a WhatsApp invite link or broadcast your community updates to a group.",
      bg: "bg-[#25D366]",
      border: "border-[#25D366]",
      ring: "focus:ring-[#25D366]",
      textColor: "text-[#25D366]",
      lightBg: "bg-green-50",
      logo: (
        <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7 text-white">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.822 6.5L4 29l7.703-1.797A11.94 11.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 2c5.523 0 10 4.477 10 10S21.523 25 16 25a9.94 9.94 0 0 1-5.02-1.352l-.36-.213-4.57 1.066 1.095-4.46-.234-.373A9.94 9.94 0 0 1 6 15c0-5.523 4.477-10 10-10zm-3.207 5.793c-.2-.002-.42.003-.625.097-.203.094-.617.364-1.02.844-.402.48-.965 1.328-.965 2.735 0 1.408 1.008 2.77 1.148 2.962.14.191 1.946 3.074 4.782 4.19 2.385.941 2.87.754 3.387.707.516-.047 1.664-.68 1.898-1.336.234-.656.234-1.219.164-1.336-.07-.117-.258-.188-.54-.328-.28-.14-1.664-.82-1.922-.914-.258-.094-.445-.14-.633.14-.187.28-.726.915-.89 1.102-.163.188-.327.211-.608.07-.281-.14-1.184-.436-2.256-1.391-.834-.742-1.398-1.659-1.562-1.94-.164-.28-.017-.43.123-.57.126-.124.281-.327.422-.492.14-.164.187-.281.281-.468.094-.187.047-.352-.023-.492-.07-.14-.62-1.523-.86-2.082-.226-.539-.46-.46-.633-.468z"/>
        </svg>
      ),
    },
    {
      id: "instagram",
      name: "Instagram",
      tagline: "Promote via bio & stories",
      description: "Add your community link to your Instagram bio and share updates through stories to attract new members.",
      bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
      border: "border-pink-400",
      ring: "focus:ring-pink-400",
      textColor: "text-pink-600",
      lightBg: "bg-pink-50",
      logo: (
        <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7 text-white">
          <path d="M16 4c-3.267 0-3.675.014-4.957.072-1.278.058-2.153.261-2.918.558a5.888 5.888 0 0 0-2.13 1.386 5.888 5.888 0 0 0-1.386 2.13c-.297.765-.5 1.64-.558 2.918C4.014 12.325 4 12.733 4 16s.014 3.675.072 4.957c.058 1.278.261 2.153.558 2.918a5.888 5.888 0 0 0 1.386 2.13 5.888 5.888 0 0 0 2.13 1.386c.765.297 1.64.5 2.918.558C12.325 27.986 12.733 28 16 28s3.675-.014 4.957-.072c1.278-.058 2.153-.261 2.918-.558a5.888 5.888 0 0 0 2.13-1.386 5.888 5.888 0 0 0 1.386-2.13c.297-.765.5-1.64.558-2.918.058-1.282.072-1.69.072-4.957s-.014-3.675-.072-4.957c-.058-1.278-.261-2.153-.558-2.918a5.888 5.888 0 0 0-1.386-2.13 5.888 5.888 0 0 0-2.13-1.386c-.765-.297-1.64-.5-2.918-.558C19.675 4.014 19.267 4 16 4zm0 2.162c3.21 0 3.59.012 4.858.07 1.172.054 1.808.25 2.231.414.561.218.961.478 1.382.899.421.421.681.821.899 1.382.164.423.36 1.059.414 2.231.058 1.268.07 1.648.07 4.858s-.012 3.59-.07 4.858c-.054 1.172-.25 1.808-.414 2.231a3.72 3.72 0 0 1-.899 1.382 3.72 3.72 0 0 1-1.382.899c-.423.164-1.059.36-2.231.414-1.268.058-1.648.07-4.858.07s-3.59-.012-4.858-.07c-1.172-.054-1.808-.25-2.231-.414a3.72 3.72 0 0 1-1.382-.899 3.72 3.72 0 0 1-.899-1.382c-.164-.423-.36-1.059-.414-2.231C6.174 19.59 6.162 19.21 6.162 16s.012-3.59.07-4.858c.054-1.172.25-1.808.414-2.231a3.72 3.72 0 0 1 .899-1.382 3.72 3.72 0 0 1 1.382-.899c.423-.164 1.059-.36 2.231-.414C12.41 6.174 12.79 6.162 16 6.162zM16 10a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm6.406-3.844a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
        </svg>
      ),
    },
    {
      id: "telegram",
      name: "Telegram",
      tagline: "Create a linked channel",
      description: "Sync your community with a Telegram channel or group so members can receive announcements instantly.",
      bg: "bg-[#2AABEE]",
      border: "border-[#2AABEE]",
      ring: "focus:ring-[#2AABEE]",
      textColor: "text-[#2AABEE]",
      lightBg: "bg-sky-50",
      logo: (
        <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7 text-white">
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm5.894 8.221-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/>
        </svg>
      ),
    },
  ];

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${color.from} ${color.to} items-center justify-center mb-4 shadow-lg`}>
              <Check size={30} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-1">Community created!</h1>
            <p className="text-neutral-500 text-sm">
              <span className="font-semibold text-neutral-700">"{form.name}"</span> is live. You're the creator and admin.
            </p>
          </motion.div>

          {/* Invite link & codes card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-4"
          >
            <div className="px-6 pt-5 pb-4 border-b border-neutral-100">
              <h2 className="text-base font-semibold text-neutral-900">Invite people to join</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Share the link or give members your invite code to get them in</p>
            </div>

            <div className="px-6 py-4 space-y-3">
              {/* Invite link */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 flex items-center gap-1.5">
                  <Link2 size={11} /> Invite link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-600 truncate select-all">
                    communityhub.app/join/{inviteCode.toLowerCase()}
                  </div>
                  <button
                    onClick={() => copyToClipboard(`https://communityhub.app/join/${inviteCode.toLowerCase()}`, "link")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                      copied === "link" ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {copied === "link" ? <><Check size={12} strokeWidth={3} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>

              {/* Invite code */}
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 flex items-center gap-1.5">
                  <KeyRound size={11} /> Invite code
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-mono font-bold text-neutral-900 tracking-widest">
                    {inviteCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(inviteCode, "code")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                      copied === "code" ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {copied === "code" ? <><Check size={12} strokeWidth={3} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>

              {/* Passcode — only for private/invite-only */}
              {passcode && (
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 flex items-center gap-1.5">
                    <Lock size={11} /> Passcode
                    <span className="text-neutral-400 font-normal">— required to join this {form.privacy === "invite" ? "invite-only" : "private"} community</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-mono font-bold text-neutral-900 tracking-widest flex items-center justify-between">
                      <span>{showPasscode ? passcode : "••••••••"}</span>
                      <button
                        onClick={() => setShowPasscode(v => !v)}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors ml-2"
                      >
                        {showPasscode ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                    <button
                      onClick={() => copyToClipboard(passcode, "pass")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                        copied === "pass" ? "bg-emerald-100 text-emerald-700" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {copied === "pass" ? <><Check size={12} strokeWidth={3} /> Copied!</> : <><Copy size={12} /> Copy</>}
                    </button>
                  </div>
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-2">
                    Share this passcode only with people you trust. You can reset it from community settings.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Integration cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden mb-5"
          >
            <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
              <h2 className="text-base font-semibold text-neutral-900">Connect your social channels</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Reach more people by linking your community to your existing social presence</p>
            </div>

            <div className="divide-y divide-neutral-100">
              {INTEGRATIONS.map((platform, idx) => (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.07 }}
                  className="flex items-center gap-4 px-6 py-4"
                >
                  {/* Logo */}
                  <div className={`w-12 h-12 rounded-xl ${platform.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    {platform.logo}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-neutral-900">{platform.name}</p>
                      <span className="text-xs text-neutral-400">{platform.tagline}</span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">{platform.description}</p>
                  </div>

                  {/* Connect button */}
                  <div className="flex-shrink-0">
                    {connected[platform.id] ? (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${platform.lightBg} ${platform.textColor} border ${platform.border}`}
                      >
                        <Check size={12} strokeWidth={3} />
                        Connected
                      </motion.span>
                    ) : (
                      <button
                        onClick={() => setConnected(prev => ({ ...prev, [platform.id]: true }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 ${platform.border} ${platform.textColor} hover:${platform.lightBg} transition-colors`}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100">
              <p className="text-xs text-neutral-400 text-center">
                Integrations can be managed anytime from your community settings
              </p>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-center gap-3"
          >
            <button
              onClick={() => navigate("/communities")}
              className="px-4 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Browse communities
            </button>
            <button
              onClick={() => { setSubmitted(false); setConnected({}); setStep(0); setForm({ name: "", description: "", category: "", tags: [], tagInput: "", color: 0, theme: 0, privacy: "public", maxMembers: 500, permissions: initialPermissions }); }}
              className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r ${color.from} ${color.to} rounded-lg hover:opacity-90 transition-opacity`}
            >
              Create another
            </button>
          </motion.div>
        </div>
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
