import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Mic, Video, BookOpen, PenTool, Church, Sparkles, Hand,
  Heart, MessageCircle, X, Instagram, Youtube, Facebook, Twitter, Send,
  Play, Mail, Lock, User, LogOut, ArrowLeft, Info, Image as ImageIcon, ArrowUpRight
} from "lucide-react";

/* ---------------------------------------------------------------
   FONTS
--------------------------------------------------------------- */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);
  return null;
};

/* ---------------------------------------------------------------
   TOKENS
--------------------------------------------------------------- */
const C = {
  bg: "#08090B",
  surface: "#121317",
  border: "rgba(255,255,255,0.09)",
  ivory: "#F7F4EC",
  ivoryDim: "#C9C3B6",
  faint: "#7C8089",
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
   DATA
--------------------------------------------------------------- */
const SPACES = [
  { id: "whispers", title: "Whispers with Oluwasogo", tag: "Podcast · Audio", desc: "Quiet conversations recorded for the moments you need a voice beside you.", welcome: "these whispers were saved for you", Icon: Mic, type: "audio", color: C.teal, span: "md:col-span-1 md:row-span-1" },
  { id: "speaks", title: "Sogo Speaks", tag: "Motivational · Video", desc: "Words meant to move you forward — for the mornings you need a push.", welcome: "let these words meet you exactly where you are", Icon: Video, type: "video", color: C.gold, span: "md:col-span-1 md:row-span-1" },
  { id: "healingpen", title: "The Healing Pen", tag: "Books · Writings", desc: "Pages written to mend, to mirror, and to make sense of the unspeakable. Read instantly, or find a hardcover near you.", welcome: "turn the page — healing is here", Icon: BookOpen, type: "book", color: C.rose, span: "md:col-span-1 md:row-span-2" },
  { id: "poetry", title: "Poetry", tag: "Poems · Acoustic", desc: "Verses that breathe — some spoken plainly, some carried by a single guitar.", welcome: "sit with these words a while", Icon: PenTool, type: "poetry", color: C.violet, span: "md:col-span-1 md:row-span-1" },
  { id: "preaches", title: "Sogo Preaches", tag: "Sermons · Video", desc: "The gospel of Christ, unpacked plainly and preached boldly.", welcome: "come in, the Word is being broken", Icon: Church, type: "video", color: C.amber, span: "md:col-span-1 md:row-span-1" },
  { id: "presence", title: "In His Presence", tag: "Worship · Video", desc: "A space set apart for praise — where the ordinary gives way to the holy.", welcome: "lay everything down and worship", Icon: Sparkles, type: "video", color: C.pink, span: "md:col-span-2 md:row-span-1" },
  { id: "holyghost", title: "The Holy Ghost in Action", tag: "Prayer · Video", desc: "Prayer sessions carried by the Spirit. Come empty-handed.", welcome: "let's enter the secret place together", Icon: Hand, type: "video", color: C.emerald, span: "md:col-span-1 md:row-span-1" },
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
const ROLES = ["Author", "Poet", "Speaker", "Visionary"];

/* ---------------------------------------------------------------
   STORAGE
--------------------------------------------------------------- */
function lsGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
function lsSet(key, value) { try { localStorage.setItem(key, value); } catch {} }

/* ---------------------------------------------------------------
   AMBIENT MESH (kept subtle, behind the grid)
--------------------------------------------------------------- */
const MeshBackground = () => {
  const blobs = [
    { color: C.emerald, top: "5%", left: "-10%", size: 420, dur: 26 },
    { color: C.violet, top: "60%", left: "85%", size: 380, dur: 30 },
    { color: C.rose, top: "85%", left: "0%", size: 340, dur: 22 },
  ];
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: C.bg }}>
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ top: b.top, left: b.left, width: b.size, height: b.size, background: b.color, opacity: 0.16, filter: "blur(120px)", mixBlendMode: "screen" }}
          animate={{ x: [0, 30, -15, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------
   REVEAL
--------------------------------------------------------------- */
const Reveal = ({ children, delay = 0, className = "", y = 20 }) => (
  <motion.div initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
    {children}
  </motion.div>
);

/* ---------------------------------------------------------------
   KINETIC HEADLINE — the one place type really moves
--------------------------------------------------------------- */
const KineticHeadline = () => (
  <motion.h1
    initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    className="font-display font-black leading-[0.98]"
    style={{ fontSize: "clamp(2.6rem,8vw,5.6rem)", color: C.ivory }}
  >
    Oluwasogo Dosunmu
  </motion.h1>
);

/* ---------------------------------------------------------------
   BENTO TILE — base building block
--------------------------------------------------------------- */
const Tile = ({ children, className = "", color = C.gold, onClick, delay = 0 }) => (
  <Reveal delay={delay} className={`relative ${className}`}>
    <motion.div
      onClick={onClick}
      whileHover={{ y: -5 }}
      className="relative h-full w-full rounded-[1.5rem] overflow-hidden cursor-pointer group p-6 flex flex-col"
      style={{ background: C.surface, border: `1px solid ${C.border}` }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 30% 0%, ${color}26, transparent 60%)`, transition: "opacity .4s" }}
      />
      <div
        className="absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1.5px ${color}99` }}
      />
      <div className="relative z-10 flex flex-col h-full">{children}</div>
    </motion.div>
  </Reveal>
);

/* ---------------------------------------------------------------
   ABOUT TILE
--------------------------------------------------------------- */
const AboutTile = () => (
  <Tile className="md:col-span-2 md:row-span-2" color={C.gold} delay={0.05}>
    <p className="font-body text-[11px] tracking-[0.3em] uppercase mb-4" style={{ color: C.gold }}>About Me</p>
    <div className="flex flex-wrap gap-2 mb-5">
      {ROLES.map((r, i) => (
        <span key={r} className="px-3 py-1 rounded-full font-body text-[10.5px] tracking-[0.08em] uppercase" style={{ border: `1px solid ${PALETTE[i % PALETTE.length]}55`, color: PALETTE[i % PALETTE.length] }}>{r}</span>
      ))}
    </div>
    <p className="font-cormorant text-[17px] md:text-[18px] leading-[1.85] overflow-y-auto pr-1" style={{ color: C.ivoryDim }}>
      My name is Oluwasogo Dosunmu—an author, poet, speaker, and creative visionary
      passionate about inspiring lives through words, faith, and music.
      <br /><br />
      I believe that every creation has the power to leave a lasting impact. Through my
      books, poetry, motivational messages, gospel teachings, prayer sessions, and
      instrumental expressions, I seek to inspire hope, ignite purpose, strengthen faith,
      and encourage personal growth.
      <br /><br />
      This platform is more than a collection of my work; it is a reflection of my journey,
      my convictions, and my commitment to creating meaningful content that uplifts,
      transforms, and connects people across the world.
      <br /><br />
      <span style={{ color: C.ivory }}>Welcome to my world—a place where creativity meets purpose, faith inspires action, and every creation carries a message worth sharing.</span>
    </p>
  </Tile>
);

/* ---------------------------------------------------------------
   SPACE TILE
--------------------------------------------------------------- */
const SpaceTile = ({ space, onClick, delay }) => {
  const { Icon } = space;
  return (
    <Tile className={space.span} color={space.color} onClick={onClick} delay={delay}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${space.color}1f` }}>
          <Icon size={17} color={space.color} />
        </div>
        <ArrowUpRight size={15} color={space.color} className="opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="font-body text-[9.5px] tracking-[0.2em] uppercase mb-1.5" style={{ color: space.color }}>{space.tag}</p>
      <h4 className="font-display text-[18px] md:text-[19px] leading-snug mb-2" style={{ color: C.ivory }}>{space.title}</h4>
      <p className="font-body text-[12px] leading-relaxed" style={{ color: C.faint }}>{space.desc}</p>
    </Tile>
  );
};

/* ---------------------------------------------------------------
   GALLERY TILE
--------------------------------------------------------------- */
const GalleryTile = () => (
  <Tile className="md:col-span-1 md:row-span-1" color={C.violet} delay={0.1}>
    <div className="flex items-center justify-between mb-3">
      <p className="font-body text-[9.5px] tracking-[0.2em] uppercase" style={{ color: C.violet }}>Gallery</p>
      <ImageIcon size={15} color={C.faint} />
    </div>
    <div className="grid grid-cols-3 gap-1.5 flex-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-md flex items-center justify-center" style={{ background: `${PALETTE[i]}14`, border: `1px dashed ${C.border}`, minHeight: 40 }}>
          <ImageIcon size={12} color={C.faint} />
        </div>
      ))}
    </div>
    <p className="font-body text-[10.5px] mt-3" style={{ color: C.faint }}>Photos & videos go here</p>
  </Tile>
);

/* ---------------------------------------------------------------
   COMING UP TILE
--------------------------------------------------------------- */
const ComingUpTile = () => (
  <Tile className="md:col-span-2 md:row-span-1" color={C.emerald} delay={0.12}>
    <div className="flex items-center justify-between mb-3">
      <p className="font-body text-[9.5px] tracking-[0.2em] uppercase" style={{ color: C.emerald }}>Coming Up</p>
      <Sparkles size={14} color={C.emerald} />
    </div>
    <div className="flex flex-wrap gap-2">
      {["New Release", "Podcast Premiere", "Book Tour", "Merch Drop"].map((l, i) => (
        <span key={i} className="px-3 py-1.5 rounded-full font-body text-[11px]" style={{ background: `${PALETTE[i % PALETTE.length]}14`, color: C.ivoryDim }}>{l}</span>
      ))}
    </div>
  </Tile>
);

/* ---------------------------------------------------------------
   SOCIAL TILE
--------------------------------------------------------------- */
const SocialTile = () => (
  <Tile className="md:col-span-1 md:row-span-1" color={C.teal} delay={0.14}>
    <p className="font-body text-[9.5px] tracking-[0.2em] uppercase mb-4" style={{ color: C.teal }}>Connect</p>
    <div className="flex items-center gap-3 flex-1">
      {[Instagram, Youtube, Facebook, Twitter].map((IconC, i) => (
        <a key={i} href="#" onClick={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ border: `1px solid ${C.border}`, color: C.ivoryDim }}><IconC size={14} /></a>
      ))}
    </div>
    <p className="font-body text-[10.5px] mt-3" style={{ color: C.faint }}>© {new Date().getFullYear()} Oluwasogo Dosunmu</p>
  </Tile>
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
    const onScroll = () => setSolid(window.scrollY > 30);
    document.addEventListener("scroll", onScroll);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <header className="sticky top-0 z-40 transition-colors duration-300" style={{ background: solid ? "rgba(8,9,11,0.85)" : "transparent", backdropFilter: solid ? "blur(14px)" : "none", borderBottom: solid ? `1px solid ${C.border}` : "1px solid transparent" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-[64px] flex items-center justify-between">
        <button onClick={onGoHome} className="font-display text-[16px] md:text-[17px]" style={{ color: C.ivory }}>Oluwasogo Dosunmu</button>
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 font-body text-[12.5px] tracking-[0.15em] uppercase px-4 py-2 rounded-full" style={{ color: C.ivory, border: `1px solid ${open ? C.gold : C.border}` }}>
            My World
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}><ChevronDown size={14} color={C.gold} /></motion.span>
          </button>
          <AnimatePresence>
            {open && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-3 w-[280px] rounded-2xl overflow-hidden" style={{ background: "rgba(18,19,23,0.97)", backdropFilter: "blur(16px)", border: `1px solid ${C.border}`, boxShadow: "0 30px 70px -15px rgba(0,0,0,0.9)" }}>
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
  const submit = (e) => { e.preventDefault(); if (!email || !password || (mode === "signup" && !name)) return; onAuth({ name: name || email.split("@")[0], email }); };
  const googleDemo = () => onAuth({ name: "Google User", email: "you@gmail.com", viaGoogle: true });

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(4,5,6,0.82)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.28 }} className="w-full max-w-sm p-8 rounded-[1.75rem] relative" style={{ background: C.surface, border: `1px solid ${C.border}`, backdropFilter: "blur(20px)", boxShadow: "0 40px 90px -20px rgba(0,0,0,0.9)" }}>
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
          <button type="submit" className="w-full py-3 rounded-xl font-body text-sm tracking-wide mt-1 transition-transform hover:scale-[1.02]" style={{ background: `linear-gradient(120deg, ${C.emerald}, ${C.gold})`, color: "#0A0F0D", fontWeight: 700 }}>{mode === "signup" ? "Sign up" : "Log in"}</button>
        </form>
        <div className="flex items-center gap-3 my-5"><div className="h-px flex-1" style={{ background: C.border }} /><span className="text-[11px] font-body" style={{ color: C.faint }}>or</span><div className="h-px flex-1" style={{ background: C.border }} /></div>
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
    const shared = lsGet(`engage_${contentId}`); const mine = lsGet(`liked_${contentId}`);
    if (shared) setData(JSON.parse(shared)); if (mine) setLikedByMe(JSON.parse(mine));
  }, [contentId]);
  const toggleLike = () => {
    const n = !likedByMe; const nd = { ...data, likes: data.likes + (n ? 1 : -1) };
    setLikedByMe(n); setData(nd); lsSet(`liked_${contentId}`, JSON.stringify(n)); lsSet(`engage_${contentId}`, JSON.stringify(nd));
  };
  const addComment = (e) => {
    e.preventDefault(); if (!draft.trim()) return;
    const nd = { ...data, comments: [...data.comments, { name: user?.name || "Guest", text: draft.trim(), ts: Date.now() }] };
    setData(nd); setDraft(""); lsSet(`engage_${contentId}`, JSON.stringify(nd));
  };
  return (
    <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-6">
        <button onClick={toggleLike} className="flex items-center gap-2 font-body text-[13px]"><Heart size={16} fill={likedByMe ? accent : "none"} color={likedByMe ? accent : C.faint} /><span style={{ color: likedByMe ? accent : C.faint }}>{data.likes}</span></button>
        <button onClick={() => setShowComments((s) => !s)} className="flex items-center gap-2 font-body text-[13px]" style={{ color: C.faint }}><MessageCircle size={16} />{data.comments.length}</button>
      </div>
      {showComments && (
        <div className="mt-4 space-y-2.5">
          {data.comments.map((c, i) => <div key={i} className="text-[13px] font-body"><span style={{ color: accent }}>{c.name}</span> <span style={{ color: C.ivoryDim }}>{c.text}</span></div>)}
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
    <div className="min-h-screen" style={{ background: C.bg }}>
      <div className="px-5 md:px-8 pt-12 pb-14 md:pt-16 md:pb-20 text-center relative" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, ${space.color}22, transparent 65%)` }} />
        <button onClick={onBack} className="absolute left-5 top-5 md:left-8 md:top-8 flex items-center gap-1.5 font-body text-[12.5px]" style={{ color: C.faint }}><ArrowLeft size={14} /> My World</button>
        <Reveal>
          <div className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center" style={{ border: `1px solid ${space.color}` }}><Icon size={24} color={space.color} /></div>
          <p className="font-body text-[11px] tracking-[0.3em] uppercase mb-3" style={{ color: space.color }}>{space.tag}</p>
          <h1 className="font-display font-bold text-4xl md:text-6xl mb-5" style={{ color: C.ivory }}>{space.title}</h1>
          <p className="font-cormorant italic text-xl md:text-2xl max-w-xl mx-auto" style={{ color: C.ivoryDim }}>{space.desc}</p>
          <p className="font-body text-[13px] mt-6" style={{ color: C.faint }}>Welcome, <span style={{ color: space.color }}>{user?.name}</span> — {space.welcome}.</p>
        </Reveal>
      </div>
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12 md:py-16 space-y-5">
        {content.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08}>
            <div className="p-6 md:p-7 rounded-[1.5rem]" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl md:text-2xl" style={{ color: C.ivory }}>{item.title}</h3>
                  <p className="font-body text-[12.5px] mt-1.5" style={{ color: C.faint }}>{item.meta}</p>
                </div>
                <div className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center" style={{ border: `1px solid ${space.color}` }}><Play size={14} color={space.color} fill={space.color} /></div>
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
   HOMEPAGE — Active Bento Grid
--------------------------------------------------------------- */
const Homepage = ({ onSelectSpace }) => (
  <>
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-14 md:pt-20 pb-10 text-center">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="font-body text-[11px] tracking-[0.4em] uppercase mb-5">
        {ROLES.map((r, i) => <span key={r} style={{ color: PALETTE[i % PALETTE.length] }}>{r}{i < ROLES.length - 1 ? <span style={{ color: C.faint }}>{"  ·  "}</span> : ""}</span>)}
      </motion.p>
      <KineticHeadline />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="font-cormorant italic mt-5 max-w-lg mx-auto" style={{ fontSize: "clamp(1rem,2vw,1.2rem)", color: C.ivoryDim }}>
        A place where creativity meets purpose, and every creation carries a message worth sharing.
      </motion.p>
    </div>

    <div className="max-w-6xl mx-auto px-5 md:px-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[150px] gap-4" style={{ gridAutoFlow: "dense" }}>
        <AboutTile />
        {SPACES.map((s, i) => <SpaceTile key={s.id} space={s} onClick={() => onSelectSpace(s.id)} delay={0.06 * i} />)}
        <GalleryTile />
        <ComingUpTile />
        <SocialTile />
      </div>
    </div>
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

  useEffect(() => { const stored = lsGet("user-profile"); if (stored) setUser(JSON.parse(stored)); }, []);

  const handleSelectSpace = useCallback((id) => {
    if (user) { setView(id); window.scrollTo(0, 0); } else { setPendingSpace(id); setAuthOpen(true); }
  }, [user]);

  const handleAuth = (profile) => {
    setUser(profile); lsSet("user-profile", JSON.stringify(profile)); setAuthOpen(false);
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
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
      `}</style>

      <MeshBackground />
      <Nav onSelectSpace={handleSelectSpace} onGoHome={() => setView("home")} />

      {user && view !== "home" && (
        <div className="max-w-6xl mx-auto px-5 md:px-8 pt-3 flex justify-end">
          <button onClick={logout} className="flex items-center gap-1.5 font-body text-[11.5px]" style={{ color: C.faint }}><LogOut size={12} /> Log out</button>
        </div>
      )}

      {view === "home" && <Homepage onSelectSpace={handleSelectSpace} />}
      {activeSpace && <SpaceView space={activeSpace} user={user} onBack={() => setView("home")} />}

      <AnimatePresence>{authOpen && <AuthModal onClose={() => setAuthOpen(false)} onAuth={handleAuth} />}</AnimatePresence>
    </div>
  );
}
