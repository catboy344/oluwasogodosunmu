import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronRight, Mic, Video, BookOpen, PenTool, Church, Sparkles, Hand,
  Heart, MessageCircle, X, Instagram, Youtube, Facebook, Twitter, Send,
  Play, Mail, Lock, User, LogOut, ArrowLeft, Info, Image as ImageIcon
} from "lucide-react";

/* ---------------------------------------------------------------
   FONTS
--------------------------------------------------------------- */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);
  return null;
};

/* ---------------------------------------------------------------
   TOKENS — alive, multi-colored, not just one tone
--------------------------------------------------------------- */
const C = {
  bg: "#0A0F0D",
  surface: "rgba(255,255,255,0.045)",
  surfaceSolid: "#13181A",
  border: "rgba(255,255,255,0.09)",
  ivory: "#F7F4EC",
  ivoryDim: "#C9C3B6",
  faint: "#7C8580",
  emerald: "#3DD68C",
  gold: "#E8B23D",
  rose: "#E85D9E",
  violet: "#9B82F0",
  teal: "#38BDB0",
  amber: "#F2944D",
  pink: "#F25C9C",
};

const PALETTE = [C.emerald, C.gold, C.rose, C.violet, C.teal, C.amber, C.pink];

/* ---------------------------------------------------------------
   DATA — each space gets its own color
--------------------------------------------------------------- */
const SPACES = [
  { id: "whispers", title: "Whispers with Oluwasogo", tag: "Podcast · Audio", desc: "Quiet conversations recorded for the moments you need a voice beside you.", welcome: "these whispers were saved for you", Icon: Mic, type: "audio", color: C.teal },
  { id: "speaks", title: "Sogo Speaks", tag: "Motivational · Video", desc: "Words meant to move you forward — for the mornings you need a push.", welcome: "let these words meet you exactly where you are", Icon: Video, type: "video", color: C.gold },
  { id: "healingpen", title: "The Healing Pen", tag: "Books · Writings", desc: "Pages written to mend, to mirror, and to make sense of the unspeakable.", welcome: "turn the page — healing is here", Icon: BookOpen, type: "book", color: C.rose },
  { id: "poetry", title: "Poetry", tag: "Poems · Acoustic", desc: "Verses that breathe — some spoken plainly, some carried by a single guitar.", welcome: "sit with these words a while", Icon: PenTool, type: "poetry", color: C.violet },
  { id: "preaches", title: "Sogo Preaches", tag: "Sermons · Video", desc: "The gospel of Christ, unpacked plainly and preached boldly.", welcome: "come in, the Word is being broken", Icon: Church, type: "video", color: C.amber },
  { id: "presence", title: "In His Presence", tag: "Worship · Video", desc: "A space set apart for praise — where the ordinary gives way to the holy.", welcome: "lay everything down and worship", Icon: Sparkles, type: "video", color: C.pink },
  { id: "holyghost", title: "The Holy Ghost in Action", tag: "Prayer · Video", desc: "Prayer sessions carried by the Spirit. Come empty-handed.", welcome: "let's enter the secret place together", Icon: Hand, type: "video", color: C.emerald },
];

const sampleContent = (space) => {
  switch (space.type) {
    case "audio": return [
      { id: `${space.id}-1`, title: "On Starting Over (Again)", meta: "24 min · Episode 01" },
      { id: `${space.id}-2`, title: "The Weight We Don't Talk About", meta: "31 min · Episode 02" },
    ];
    case "book": return [
      { id: `${space.id}-1`, title: "Letters I Never Sent", meta: "Poetry & Prose · 142 pages", price: "₦3,500", blurb: "A quiet collection on grief, faith, and the words we keep folded in our pockets." },
      { id: `${space.id}-2`, title: "Still Standing", meta: "Memoir · 210 pages", price: "₦4,200", blurb: "A personal account of holding onto purpose when everything else gave way." },
    ];
    case "poetry": return [
      { id: `${space.id}-1`, title: "Unfinished Prayer", meta: "Spoken · 3 min" },
      { id: `${space.id}-2`, title: "Acoustic: What the River Knows", meta: "Acoustic · 4 min" },
    ];
    default: return [
      { id: `${space.id}-1`, title: `${space.title} — Vol. 1`, meta: "Video · 18 min" },
      { id: `${space.id}-2`, title: `${space.title} — Vol. 2`, meta: "Video · 22 min" },
    ];
  }
};

const COMING_UP = ["New Release", "Podcast Premiere", "Upcoming Event", "Merch Drop", "Featured Sermon", "Book Tour"];
const ROLES = ["Author", "Poet", "Speaker", "Visionary"];

/* ---------------------------------------------------------------
   STORAGE
--------------------------------------------------------------- */
function lsGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
function lsSet(key, value) { try { localStorage.setItem(key, value); } catch {} }

/* ---------------------------------------------------------------
   LIVING MESH BACKGROUND — the signature element
--------------------------------------------------------------- */
const MeshBackground = () => {
  const blobs = [
    { color: C.emerald, top: "8%", left: "-8%", size: 460, dur: 24 },
    { color: C.gold, top: "55%", left: "75%", size: 420, dur: 28 },
    { color: C.rose, top: "75%", left: "5%", size: 380, dur: 20 },
    { color: C.violet, top: "5%", left: "60%", size: 360, dur: 26 },
    { color: C.teal, top: "35%", left: "35%", size: 340, dur: 22 },
  ];
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: C.bg }}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: b.top, left: b.left, width: b.size, height: b.size,
            background: b.color, opacity: 0.28, filter: "blur(100px)", mixBlendMode: "screen",
          }}
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, rgba(10,15,13,0.5) 60%, rgba(10,15,13,0.92) 100%)" }} />
    </div>
  );
};

/* ---------------------------------------------------------------
   REVEAL
--------------------------------------------------------------- */
const Reveal = ({ children, delay = 0, className = "", y = 22 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ---------------------------------------------------------------
   HORIZONTAL ROW
--------------------------------------------------------------- */
const Row = ({ title, subtitle, children }) => (
  <div className="py-4">
    <div className="mb-4 px-5 md:px-8 max-w-6xl mx-auto">
      <h3 className="font-display text-xl md:text-2xl" style={{ color: C.ivory }}>{title}</h3>
      {subtitle && <p className="font-body text-[12.5px] mt-1" style={{ color: C.faint }}>{subtitle}</p>}
    </div>
    <div className="flex gap-4 overflow-x-auto px-5 md:px-8 pb-3 snap-x snap-mandatory max-w-6xl mx-auto" style={{ scrollbarWidth: "none" }}>
      {children}
    </div>
  </div>
);

/* ---------------------------------------------------------------
   SPACE CARD — colorful, organic accent per space
--------------------------------------------------------------- */
const SpaceCard = ({ space, onClick }) => {
  const { Icon } = space;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -8 }}
      className="snap-start shrink-0 w-[250px] md:w-[270px] text-left rounded-[1.75rem] overflow-hidden relative group"
      style={{ background: C.surfaceSolid, border: `1px solid ${C.border}` }}
    >
      <div className="h-28 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 30% 20%, ${space.color}55, transparent 70%)` }} />
        <div
          className="absolute w-20 h-20 rounded-full"
          style={{ background: space.color, opacity: 0.35, filter: "blur(28px)", top: "10%", right: "-10%" }}
        />
        <Icon size={28} color={space.color} strokeWidth={1.6} className="relative" />
      </div>
      <div className="p-4">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-1.5" style={{ color: space.color }}>{space.tag}</p>
        <h4 className="font-display text-[16.5px] leading-snug mb-1.5" style={{ color: C.ivory }}>{space.title}</h4>
        <p className="font-body text-[12px] leading-relaxed line-clamp-2" style={{ color: C.faint }}>{space.desc}</p>
      </div>
      <div className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: `inset 0 0 0 1.5px ${space.color}, 0 25px 50px -15px ${space.color}66` }} />
    </motion.button>
  );
};

/* ---------------------------------------------------------------
   GALLERY TILE (modest — not the hero focal point anymore)
--------------------------------------------------------------- */
const GalleryTile = ({ i }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="snap-start shrink-0 w-[130px] aspect-[3/4] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center gap-2"
    style={{ background: C.surfaceSolid, border: `1px dashed ${C.border}` }}
  >
    <div className="absolute w-16 h-16 rounded-full" style={{ background: PALETTE[i % PALETTE.length], opacity: 0.25, filter: "blur(20px)" }} />
    <ImageIcon size={18} color={C.faint} className="relative" />
    <p className="relative font-body text-[9.5px] text-center px-2" style={{ color: C.faint }}>Add photo</p>
  </motion.div>
);

/* ---------------------------------------------------------------
   POSTER CARD
--------------------------------------------------------------- */
const PosterCard = ({ label, i }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="snap-start shrink-0 w-[140px] md:w-[160px] aspect-[2/3] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center gap-2 p-3 text-center"
    style={{ background: C.surfaceSolid, border: `1px solid ${C.border}` }}
  >
    <div className="absolute w-24 h-24 rounded-full" style={{ background: PALETTE[i % PALETTE.length], opacity: 0.3, filter: "blur(26px)", top: "-10%", left: "-10%" }} />
    <Sparkles size={16} color={PALETTE[i % PALETTE.length]} className="relative" />
    <p className="relative font-body text-[11px] leading-tight" style={{ color: C.ivoryDim }}>{label}</p>
    <span className="relative font-body text-[8.5px] uppercase tracking-[0.15em]" style={{ color: C.faint }}>Coming Soon</span>
  </motion.div>
);

/* ---------------------------------------------------------------
   HERO
--------------------------------------------------------------- */
const Hero = ({ onEnter, onAbout }) => (
  <div className="relative min-h-[88vh] flex flex-col justify-center px-5 md:px-8 pt-24 pb-16">
    <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
        className="font-body text-[11px] tracking-[0.4em] uppercase mb-6"
      >
        {ROLES.map((r, i) => (
          <span key={r} style={{ color: PALETTE[i % PALETTE.length] }}>
            {r}{i < ROLES.length - 1 ? <span style={{ color: C.faint }}>{"  ·  "}</span> : ""}
          </span>
        ))}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="font-display font-black leading-[0.98]"
        style={{ fontSize: "clamp(2.8rem,9vw,6.5rem)", color: C.ivory }}
      >
        Oluwasogo Dosunmu
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
        className="font-cormorant italic mt-6 max-w-lg mx-auto" style={{ fontSize: "clamp(1.05rem,2vw,1.35rem)", color: C.ivoryDim }}
      >
        Welcome to my world — where creativity meets purpose, and every creation carries a message worth sharing.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-3.5 mt-9"
      >
        <button
          onClick={onEnter}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-body text-[14px] tracking-wide transition-transform hover:scale-[1.04]"
          style={{ background: `linear-gradient(120deg, ${C.emerald}, ${C.gold})`, color: "#0A0F0D", fontWeight: 700 }}
        >
          <Play size={16} fill="#0A0F0D" /> Enter My World
        </button>
        <button
          onClick={onAbout}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-body text-[14px] tracking-wide"
          style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, color: C.ivory }}
        >
          <Info size={16} /> About Me
        </button>
      </motion.div>
    </div>
  </div>
);

/* ---------------------------------------------------------------
   ABOUT — no placeholder box, just rich color + text
--------------------------------------------------------------- */
const About = () => (
  <section id="about" className="max-w-4xl mx-auto px-5 md:px-8 py-14 md:py-20 relative">
    <Reveal>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {ROLES.map((r, i) => (
          <span key={r} className="px-3.5 py-1.5 rounded-full font-body text-[11px] tracking-[0.1em] uppercase" style={{ border: `1px solid ${PALETTE[i % PALETTE.length]}66`, color: PALETTE[i % PALETTE.length] }}>{r}</span>
        ))}
      </div>
    </Reveal>
    <Reveal delay={0.08}>
      <p className="font-cormorant text-[19px] md:text-[21px] leading-[1.9] text-center" style={{ color: C.ivoryDim }}>
        My name is Oluwasogo Dosunmu—an author, poet, speaker, and creative visionary
        passionate about inspiring lives through words, faith, and music.
        <br /><br />
        I believe that every creation has the power to leave a lasting impact. Through my
        books, poetry, motivational messages, gospel teachings, prayer sessions, and
        instrumental expressions, I seek to inspire hope, ignite purpose, strengthen faith,
        and encourage personal growth.
        <br /><br />
        This platform is more than a collection of my work; it is a reflection of my
        journey, my convictions, and my commitment to creating meaningful content that
        uplifts, transforms, and connects people across the world.
        <br /><br />
        My mission is simple: to use every gift entrusted to me to inspire hearts, challenge
        minds, and point people toward purpose, excellence, and God.
      </p>
    </Reveal>
  </section>
);

/* ---------------------------------------------------------------
   NAV
--------------------------------------------------------------- */
const Nav = ({ onSelectSpace, onGoHome }) => {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    const onScroll = () => setSolid(window.scrollY > 40);
    document.addEventListener("scroll", onScroll);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-colors duration-300" style={{ background: solid ? "rgba(10,15,13,0.85)" : "transparent", backdropFilter: solid ? "blur(14px)" : "none", borderBottom: solid ? `1px solid ${C.border}` : "1px solid transparent" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-[64px] flex items-center justify-between">
        <button onClick={onGoHome} className="font-display text-[16px] md:text-[17px]" style={{ color: C.ivory }}>Oluwasogo Dosunmu</button>
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 font-body text-[12.5px] tracking-[0.15em] uppercase px-4 py-2 rounded-full" style={{ color: C.ivory, border: `1px solid ${open ? C.gold : C.border}` }}>
            My World
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}><ChevronDown size={14} color={C.gold} /></motion.span>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-3 w-[280px] rounded-2xl overflow-hidden" style={{ background: "rgba(19,24,26,0.97)", backdropFilter: "blur(16px)", border: `1px solid ${C.border}`, boxShadow: "0 30px 70px -15px rgba(0,0,0,0.9)" }}>
                {SPACES.map((s, i) => (
                  <button key={s.id} onClick={() => { setOpen(false); onSelectSpace(s.id); }} className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-white/[0.04]" style={{ borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}>
                    <s.Icon size={14} color={s.color} className="mt-0.5 shrink-0" />
                    <span>
                      <span className="block font-body text-[13px]" style={{ color: C.ivory }}>{s.title}</span>
                      <span className="block font-body text-[10.5px] mt-0.5" style={{ color: C.faint }}>{s.tag}</span>
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

/* ---------------------------------------------------------------
   AUTH MODAL
--------------------------------------------------------------- */
const AuthModal = ({ onClose, onAuth }) => {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) return;
    onAuth({ name: name || email.split("@")[0], email });
  };
  const googleDemo = () => onAuth({ name: "Google User", email: "you@gmail.com", viaGoogle: true });

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(5,8,7,0.82)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.28 }} className="w-full max-w-sm p-8 rounded-[1.75rem] relative" style={{ background: C.surfaceSolid, border: `1px solid ${C.border}`, boxShadow: "0 40px 90px -20px rgba(0,0,0,0.9)" }}>
        <button onClick={onClose} className="absolute top-5 right-5" style={{ color: C.faint }}><X size={18} /></button>
        <p className="font-body text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: C.gold }}>{mode === "signup" ? "Join the world" : "Welcome back"}</p>
        <h3 className="font-display text-2xl mb-7" style={{ color: C.ivory }}>{mode === "signup" ? "Create your account" : "Log in"}</h3>
        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl" style={{ border: `1px solid ${C.border}` }}>
              <User size={15} color={C.faint} />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="bg-transparent outline-none w-full font-body text-sm" style={{ color: C.ivory }} />
            </div>
          )}
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl" style={{ border: `1px solid ${C.border}` }}>
            <Mail size={15} color={C.faint} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" className="bg-transparent outline-none w-full font-body text-sm" style={{ color: C.ivory }} />
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl" style={{ border: `1px solid ${C.border}` }}>
            <Lock size={15} color={C.faint} />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="bg-transparent outline-none w-full font-body text-sm" style={{ color: C.ivory }} />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl font-body text-sm tracking-wide mt-1 transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(120deg, ${C.emerald}, ${C.gold})`, color: "#0A0F0D", fontWeight: 700 }}>
            {mode === "signup" ? "Sign up" : "Log in"}
          </button>
        </form>
        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1" style={{ background: C.border }} />
          <span className="text-[11px] font-body" style={{ color: C.faint }}>or</span>
          <div className="h-px flex-1" style={{ background: C.border }} />
        </div>
        <button onClick={googleDemo} className="w-full py-3 rounded-xl font-body text-sm" style={{ border: `1px solid ${C.border}`, color: C.ivory }}>Continue with Google</button>
        <p className="text-[10.5px] font-body mt-2 text-center" style={{ color: C.faint }}>(Demo mode — real Google sign-in connects when your database is wired up)</p>
        <p className="text-center font-body text-[12.5px] mt-6" style={{ color: C.faint }}>
          {mode === "signup" ? "Already have an account? " : "New here? "}
          <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")} style={{ color: C.gold }}>{mode === "signup" ? "Log in" : "Sign up"}</button>
        </p>
      </motion.div>
    </motion.div>
  );
};

/* ---------------------------------------------------------------
   ENGAGEMENT
--------------------------------------------------------------- */
const Engagement = ({ contentId, user, accent }) => {
  const [data, setData] = useState({ likes: 0, comments: [] });
  const [likedByMe, setLikedByMe] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const shared = lsGet(`engage_${contentId}`);
    const mine = lsGet(`liked_${contentId}`);
    if (shared) setData(JSON.parse(shared));
    if (mine) setLikedByMe(JSON.parse(mine));
  }, [contentId]);

  const toggleLike = () => {
    const n = !likedByMe;
    const nd = { ...data, likes: data.likes + (n ? 1 : -1) };
    setLikedByMe(n); setData(nd);
    lsSet(`liked_${contentId}`, JSON.stringify(n));
    lsSet(`engage_${contentId}`, JSON.stringify(nd));
  };
  const addComment = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const nd = { ...data, comments: [...data.comments, { name: user?.name || "Guest", text: draft.trim(), ts: Date.now() }] };
    setData(nd); setDraft("");
    lsSet(`engage_${contentId}`, JSON.stringify(nd));
  };

  return (
    <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-6">
        <button onClick={toggleLike} className="flex items-center gap-2 font-body text-[13px]">
          <Heart size={16} fill={likedByMe ? accent : "none"} color={likedByMe ? accent : C.faint} />
          <span style={{ color: likedByMe ? accent : C.faint }}>{data.likes}</span>
        </button>
        <button onClick={() => setShowComments((s) => !s)} className="flex items-center gap-2 font-body text-[13px]" style={{ color: C.faint }}>
          <MessageCircle size={16} />{data.comments.length}
        </button>
      </div>
      {showComments && (
        <div className="mt-4 space-y-2.5">
          {data.comments.map((c, i) => (
            <div key={i} className="text-[13px] font-body"><span style={{ color: accent }}>{c.name}</span> <span style={{ color: C.ivoryDim }}>{c.text}</span></div>
          ))}
          <form onSubmit={addComment} className="flex gap-2 mt-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Leave a comment..." className="flex-1 bg-transparent outline-none font-body text-[13px] px-3.5 py-2.5 rounded-xl" style={{ border: `1px solid ${C.border}`, color: C.ivory }} />
            <button type="submit" style={{ color: accent }}><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------------
   SPACE VIEW
--------------------------------------------------------------- */
const SpaceView = ({ space, user, onBack }) => {
  const content = sampleContent(space);
  const { Icon } = space;
  return (
    <div className="min-h-screen pt-[64px]" style={{ background: C.bg }}>
      <div className="px-5 md:px-8 pt-12 pb-14 md:pt-16 md:pb-20 text-center relative" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, ${space.color}22, transparent 65%)` }} />
        <button onClick={onBack} className="absolute left-5 top-5 md:left-8 md:top-8 flex items-center gap-1.5 font-body text-[12.5px]" style={{ color: C.faint }}>
          <ArrowLeft size={14} /> My World
        </button>
        <Reveal>
          <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center" style={{ border: `1px solid ${space.color}` }}>
            <Icon size={24} color={space.color} />
          </div>
          <p className="font-body text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: space.color }}>{space.tag}</p>
          <h1 className="font-display font-bold text-4xl md:text-6xl mb-5" style={{ color: C.ivory }}>{space.title}</h1>
          <p className="font-cormorant italic text-xl md:text-2xl max-w-xl mx-auto" style={{ color: C.ivoryDim }}>{space.desc}</p>
          <p className="font-body text-[13px] mt-6" style={{ color: C.faint }}>Welcome, <span style={{ color: space.color }}>{user?.name}</span> — {space.welcome}.</p>
        </Reveal>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 space-y-5">
        {content.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08}>
            <div className="p-6 md:p-7 rounded-[1.5rem]" style={{ background: C.surfaceSolid, border: `1px solid ${C.border}` }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl md:text-2xl" style={{ color: C.ivory }}>{item.title}</h3>
                  <p className="font-body text-[12.5px] mt-1.5" style={{ color: C.faint }}>{item.meta}</p>
                </div>
                <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center" style={{ border: `1px solid ${space.color}` }}>
                  <Play size={14} color={space.color} fill={space.color} />
                </div>
              </div>
              {space.type === "book" && (
                <div className="mt-4">
                  <p className="font-cormorant italic text-[15px]" style={{ color: C.ivoryDim }}>{item.blurb}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <button className="px-5 py-2.5 rounded-xl font-body text-[12.5px]" style={{ background: space.color, color: "#0A0F0D", fontWeight: 700 }}>Read PDF · {item.price}</button>
                    <button className="px-5 py-2.5 rounded-xl font-body text-[12.5px]" style={{ border: `1px solid ${C.border}`, color: C.ivoryDim }}>Where to buy hardcover</button>
                  </div>
                </div>
              )}
              <Engagement contentId={item.id} user={user} accent={space.color} />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   HOMEPAGE
--------------------------------------------------------------- */
const Homepage = ({ onEnter, onSelectSpace }) => (
  <>
    <Hero onEnter={onEnter} onAbout={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} />
    <About />

    <Row title="My World" subtitle="Seven spaces — pick where you want to be">
      {SPACES.map((s) => <SpaceCard key={s.id} space={s} onClick={() => onSelectSpace(s.id)} />)}
    </Row>

    <Row title="Gallery" subtitle="Photos and videos will appear here">
      {[0, 1, 2, 3, 4].map((i) => <GalleryTile key={i} i={i} />)}
    </Row>

    <Row title="Coming Up" subtitle="New releases, sermons, and drops">
      {COMING_UP.map((label, i) => <PosterCard key={i} label={label} i={i} />)}
    </Row>

    <footer className="px-5 md:px-8 py-12 mt-8" style={{ borderTop: `1px solid ${C.border}` }}>
      <Reveal>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-body text-[12.5px]" style={{ color: C.faint }}>© {new Date().getFullYear()} Oluwasogo Dosunmu. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {[Instagram, Youtube, Facebook, Twitter].map((IconC, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.border}`, color: C.ivoryDim }}><IconC size={15} /></a>
            ))}
          </div>
        </div>
      </Reveal>
    </footer>
  </>
);

/* ---------------------------------------------------------------
   ROOT
--------------------------------------------------------------- */
export default function Site() {
  const [view, setView] = useState("home");
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingSpace, setPendingSpace] = useState(null);

  useEffect(() => {
    const stored = lsGet("user-profile");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleSelectSpace = useCallback((id) => {
    if (user) { setView(id); window.scrollTo(0, 0); }
    else { setPendingSpace(id); setAuthOpen(true); }
  }, [user]);

  const handleAuth = (profile) => {
    setUser(profile);
    lsSet("user-profile", JSON.stringify(profile));
    setAuthOpen(false);
    if (pendingSpace) { setView(pendingSpace); setPendingSpace(null); window.scrollTo(0, 0); }
  };

  const logout = () => { setUser(null); setView("home"); lsSet("user-profile", ""); };
  const activeSpace = SPACES.find((s) => s.id === view);

  return (
    <div style={{ minHeight: "100vh" }}>
      <FontLoader />
      <style>{`
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(232,178,61,0.3); }
        ::-webkit-scrollbar { height: 0px; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <MeshBackground />
      <Nav onSelectSpace={handleSelectSpace} onGoHome={() => setView("home")} />

      {user && view !== "home" && (
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-[78px] flex justify-end">
          <button onClick={logout} className="flex items-center gap-1.5 font-body text-[11.5px]" style={{ color: C.faint }}><LogOut size={12} /> Log out</button>
        </div>
      )}

      {view === "home" && <Homepage onEnter={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} onSelectSpace={handleSelectSpace} />}
      {activeSpace && <SpaceView space={activeSpace} user={user} onBack={() => setView("home")} />}

      <AnimatePresence>{authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuth={handleAuth} />}</AnimatePresence>
    </div>
  );
}
