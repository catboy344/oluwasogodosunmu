import React, { useState, useEffect, useCallback } from "react";
import {
  Lock, LayoutDashboard, UploadCloud, FolderOpen, CreditCard, Users,
  Heart, MessageCircle, TrendingUp, DollarSign, Trash2, LogOut,
  Mic, Video, BookOpen, PenTool, Church, Sparkles, Hand, CheckCircle2, Clock
} from "lucide-react";

/* ---------------------------------------------------------------
   FONTS + TOKENS (matches main site)
--------------------------------------------------------------- */
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch {} };
  }, []);
  return null;
};

const C = {
  bg: "#050505",
  panel: "#0D0D0D",
  panelAlt: "#101010",
  ivory: "#F4EFE6",
  ivoryDim: "#B5AFA2",
  faint: "#6E6A60",
  gold: "#C9A24B",
  hairline: "rgba(201,162,75,0.18)",
  hairlineSoft: "rgba(255,255,255,0.07)",
  good: "#7FB88A",
  warn: "#D9A441",
};

const ADMIN_PASSWORD = "sogo2026"; // demo only — replace with real auth at deploy

const SPACES = [
  { id: "whispers", title: "Whispers with Oluwasogo", Icon: Mic, type: "audio" },
  { id: "speaks", title: "Sogo Speaks", Icon: Video, type: "video" },
  { id: "healingpen", title: "The Healing Pen", Icon: BookOpen, type: "book" },
  { id: "poetry", title: "Poetry", Icon: PenTool, type: "poetry" },
  { id: "preaches", title: "Sogo Preaches", Icon: Church, type: "video" },
  { id: "presence", title: "In His Presence", Icon: Sparkles, type: "video" },
  { id: "holyghost", title: "The Holy Ghost in Action", Icon: Hand, type: "video" },
];

const DEFAULT_CONTENT = [
  { id: "whispers-1", spaceId: "whispers", title: "On Starting Over (Again)", meta: "24 min · Episode 01" },
  { id: "whispers-2", spaceId: "whispers", title: "The Weight We Don't Talk About", meta: "31 min · Episode 02" },
  { id: "speaks-1", spaceId: "speaks", title: "Sogo Speaks — Vol. 1", meta: "Video · 18 min" },
  { id: "speaks-2", spaceId: "speaks", title: "Sogo Speaks — Vol. 2", meta: "Video · 22 min" },
  { id: "healingpen-1", spaceId: "healingpen", title: "Letters I Never Sent", meta: "142 pages", price: "₦3,500" },
  { id: "healingpen-2", spaceId: "healingpen", title: "Still Standing", meta: "210 pages", price: "₦4,200" },
  { id: "poetry-1", spaceId: "poetry", title: "Unfinished Prayer", meta: "Spoken · 3 min" },
  { id: "poetry-2", spaceId: "poetry", title: "Acoustic: What the River Knows", meta: "Acoustic · 4 min" },
  { id: "preaches-1", spaceId: "preaches", title: "Sogo Preaches — Vol. 1", meta: "Video · 18 min" },
  { id: "preaches-2", spaceId: "preaches", title: "Sogo Preaches — Vol. 2", meta: "Video · 22 min" },
  { id: "presence-1", spaceId: "presence", title: "In His Presence — Vol. 1", meta: "Video · 18 min" },
  { id: "presence-2", spaceId: "presence", title: "In His Presence — Vol. 2", meta: "Video · 22 min" },
  { id: "holyghost-1", spaceId: "holyghost", title: "The Holy Ghost in Action — Vol. 1", meta: "Video · 18 min" },
  { id: "holyghost-2", spaceId: "holyghost", title: "The Holy Ghost in Action — Vol. 2", meta: "Video · 22 min" },
];

const DEMO_PAYMENTS = [
  { id: 1, buyer: "Tobi A.", item: "Letters I Never Sent (PDF)", amount: "₦3,500", date: "Jun 18, 2026", status: "paid" },
  { id: 2, buyer: "Grace O.", item: "Still Standing (PDF)", amount: "₦4,200", date: "Jun 15, 2026", status: "paid" },
  { id: 3, buyer: "David E.", item: "Letters I Never Sent (PDF)", amount: "₦3,500", date: "Jun 10, 2026", status: "pending" },
];

const DEMO_AUDIENCE = [
  { name: "Tobi A.", email: "tobi***@gmail.com", joined: "Jun 18, 2026" },
  { name: "Grace O.", email: "grace***@gmail.com", joined: "Jun 15, 2026" },
  { name: "David E.", email: "david***@gmail.com", joined: "Jun 10, 2026" },
  { name: "Amaka N.", email: "amaka***@gmail.com", joined: "Jun 3, 2026" },
];

/* ---------------------------------------------------------------
   STORAGE HELPERS
--------------------------------------------------------------- */
async function safeGet(key, shared) {
  try { return localStorage.getItem(key); } catch { return null; }
}
async function safeSet(key, value, shared) {
  try { localStorage.setItem(key, value); } catch {}
}

/* ---------------------------------------------------------------
   LOGIN GATE
--------------------------------------------------------------- */
const AdminLogin = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (password.trim().toLowerCase() === ADMIN_PASSWORD) onSuccess();
    else setError(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: C.bg }}>
      <div className="w-full max-w-sm p-8" style={{ background: C.panel, border: `1px solid ${C.hairline}` }}>
        <div className="w-12 h-12 flex items-center justify-center mb-6" style={{ border: `1px solid ${C.gold}` }}>
          <Lock size={18} color={C.gold} />
        </div>
        <p className="font-body text-[11px] tracking-[0.3em] uppercase mb-2" style={{ color: C.gold }}>Private</p>
        <h1 className="font-display text-2xl mb-7" style={{ color: C.ivory }}>Admin Access</h1>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-transparent outline-none font-body text-sm px-3.5 py-3"
            style={{ border: `1px solid ${error ? "#C25450" : C.hairline}`, color: C.ivory }}
          />
          {error && <p className="font-body text-[12px]" style={{ color: "#C25450" }}>Incorrect password — try again.</p>}
          <button type="submit" className="w-full py-3 font-body text-sm tracking-wide" style={{ background: C.gold, color: "#1A1304", fontWeight: 600 }}>
            Enter Dashboard
          </button>
        </form>
        <p className="font-body text-[11px] mt-6 leading-relaxed" style={{ color: C.faint }}>
          Demo password: <span style={{ color: C.ivoryDim }}>sogo2026</span>. This swaps for a real, private login once we deploy.
        </p>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STAT CARD
--------------------------------------------------------------- */
const StatCard = ({ label, value, Icon, sub }) => (
  <div className="p-5" style={{ background: C.panel, border: `1px solid ${C.hairline}` }}>
    <div className="flex items-center justify-between mb-4">
      <span className="font-body text-[11px] tracking-[0.2em] uppercase" style={{ color: C.faint }}>{label}</span>
      <Icon size={15} color={C.gold} />
    </div>
    <p className="font-display text-3xl" style={{ color: C.ivory }}>{value}</p>
    {sub && <p className="font-body text-[11.5px] mt-1.5" style={{ color: C.faint }}>{sub}</p>}
  </div>
);

/* ---------------------------------------------------------------
   OVERVIEW
--------------------------------------------------------------- */
const Overview = ({ allContent, engagement }) => {
  const totalLikes = Object.values(engagement).reduce((s, e) => s + (e?.likes || 0), 0);
  const totalComments = Object.values(engagement).reduce((s, e) => s + (e?.comments?.length || 0), 0);
  const revenue = DEMO_PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount.replace(/[₦,]/g, "")), 0);

  return (
    <div>
      <h2 className="font-display text-2xl mb-1" style={{ color: C.ivory }}>Overview</h2>
      <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>A snapshot of everything happening across your world.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Likes" value={totalLikes} Icon={Heart} sub="Across all spaces" />
        <StatCard label="Total Comments" value={totalComments} Icon={MessageCircle} sub="Across all spaces" />
        <StatCard label="Signed-up Users" value={DEMO_AUDIENCE.length} Icon={Users} sub="Demo data for now" />
        <StatCard label="Revenue" value={`₦${revenue.toLocaleString()}`} Icon={DollarSign} sub="From book sales" />
      </div>

      <h3 className="font-body text-[11px] tracking-[0.25em] uppercase mb-4" style={{ color: C.gold }}>Engagement by Space</h3>
      <div className="space-y-2">
        {SPACES.map((s) => {
          const items = allContent.filter((c) => c.spaceId === s.id);
          const likes = items.reduce((sum, it) => sum + (engagement[it.id]?.likes || 0), 0);
          const comments = items.reduce((sum, it) => sum + (engagement[it.id]?.comments?.length || 0), 0);
          return (
            <div key={s.id} className="flex items-center justify-between py-3.5" style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}>
              <div className="flex items-center gap-3">
                <s.Icon size={15} color={C.gold} />
                <span className="font-body text-[13.5px]" style={{ color: C.ivory }}>{s.title}</span>
              </div>
              <div className="flex items-center gap-5 font-body text-[12.5px]" style={{ color: C.faint }}>
                <span className="flex items-center gap-1.5"><Heart size={13} /> {likes}</span>
                <span className="flex items-center gap-1.5"><MessageCircle size={13} /> {comments}</span>
                <span>{items.length} uploads</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   UPLOAD CONTENT
--------------------------------------------------------------- */
const UploadContent = ({ onUpload }) => {
  const [spaceId, setSpaceId] = useState(SPACES[0].id);
  const [title, setTitle] = useState("");
  const [meta, setMeta] = useState("");
  const [price, setPrice] = useState("");
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);

  const space = SPACES.find((s) => s.id === spaceId);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newItem = {
      id: `${spaceId}-custom-${Date.now()}`,
      spaceId,
      title: title.trim(),
      meta: meta.trim() || (space.type === "audio" ? "Audio" : space.type === "book" ? "Book" : "Video"),
      price: space.type === "book" ? price : undefined,
      fileName: fileName || "(no file attached — connect storage at deploy)",
    };
    await onUpload(newItem);
    setTitle(""); setMeta(""); setPrice(""); setFileName("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2400);
  };

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-2xl mb-1" style={{ color: C.ivory }}>Upload Content</h2>
      <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>
        Add a new piece to one of your spaces. Metadata saves now; real file storage connects when we deploy.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.gold }}>Space</label>
          <select
            value={spaceId}
            onChange={(e) => setSpaceId(e.target.value)}
            className="w-full bg-transparent outline-none font-body text-sm px-3.5 py-3"
            style={{ border: `1px solid ${C.hairline}`, color: C.ivory }}
          >
            {SPACES.map((s) => (
              <option key={s.id} value={s.id} style={{ background: C.panel }}>{s.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.gold }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Letters I Never Sent" className="w-full bg-transparent outline-none font-body text-sm px-3.5 py-3" style={{ border: `1px solid ${C.hairline}`, color: C.ivory }} />
        </div>

        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.gold }}>Description / Duration</label>
          <input value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="e.g. 24 min · Episode 03" className="w-full bg-transparent outline-none font-body text-sm px-3.5 py-3" style={{ border: `1px solid ${C.hairline}`, color: C.ivory }} />
        </div>

        {space.type === "book" && (
          <div>
            <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.gold }}>Price</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. ₦3,500" className="w-full bg-transparent outline-none font-body text-sm px-3.5 py-3" style={{ border: `1px solid ${C.hairline}`, color: C.ivory }} />
          </div>
        )}

        <div>
          <label className="font-body text-[11px] tracking-[0.2em] uppercase block mb-2" style={{ color: C.gold }}>File</label>
          <label
            className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer"
            style={{ border: `1px dashed ${C.hairline}` }}
          >
            <UploadCloud size={20} color={C.gold} />
            <span className="font-body text-[12.5px]" style={{ color: C.ivoryDim }}>
              {fileName ? fileName : `Click to choose ${space.type === "audio" ? "an audio" : space.type === "book" ? "a PDF" : "a video"} file`}
            </span>
            <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
          </label>
          <p className="font-body text-[10.5px] mt-2" style={{ color: C.faint }}>
            Files aren't stored yet in this preview — real upload connects to Cloudinary/Supabase at deploy.
          </p>
        </div>

        <button type="submit" className="px-6 py-3 font-body text-sm tracking-wide" style={{ background: C.gold, color: "#1A1304", fontWeight: 600 }}>
          Save Content
        </button>
        {success && <p className="font-body text-[12.5px]" style={{ color: C.good }}>Saved — visible in Manage Content.</p>}
      </form>
    </div>
  );
};

/* ---------------------------------------------------------------
   MANAGE CONTENT
--------------------------------------------------------------- */
const ManageContent = ({ allContent, engagement, onDelete }) => {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? allContent : allContent.filter((c) => c.spaceId === filter);

  return (
    <div>
      <h2 className="font-display text-2xl mb-1" style={{ color: C.ivory }}>Manage Content</h2>
      <p className="font-body text-[13px] mb-6" style={{ color: C.faint }}>Everything you've published, with live likes and comments.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter("all")} className="px-3.5 py-1.5 font-body text-[12px]" style={{ border: `1px solid ${filter === "all" ? C.gold : C.hairline}`, color: filter === "all" ? C.gold : C.faint }}>All</button>
        {SPACES.map((s) => (
          <button key={s.id} onClick={() => setFilter(s.id)} className="px-3.5 py-1.5 font-body text-[12px]" style={{ border: `1px solid ${filter === s.id ? C.gold : C.hairline}`, color: filter === s.id ? C.gold : C.faint }}>
            {s.title}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((item) => {
          const e = engagement[item.id] || { likes: 0, comments: [] };
          const space = SPACES.find((s) => s.id === item.spaceId);
          const isCustom = item.id.includes("-custom-");
          return (
            <div key={item.id} className="flex items-center justify-between py-4 px-1" style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}>
              <div className="flex items-center gap-3 min-w-0">
                <space.Icon size={15} color={C.gold} className="shrink-0" />
                <div className="min-w-0">
                  <p className="font-body text-[13.5px] truncate" style={{ color: C.ivory }}>{item.title}</p>
                  <p className="font-body text-[11.5px]" style={{ color: C.faint }}>{space.title} · {item.meta}{item.price ? ` · ${item.price}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="hidden sm:flex items-center gap-1.5 font-body text-[12px]" style={{ color: C.faint }}><Heart size={13} /> {e.likes}</span>
                <span className="hidden sm:flex items-center gap-1.5 font-body text-[12px]" style={{ color: C.faint }}><MessageCircle size={13} /> {e.comments.length}</span>
                {isCustom && (
                  <button onClick={() => onDelete(item.id)} style={{ color: C.faint }}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   PAYMENTS
--------------------------------------------------------------- */
const Payments = () => {
  const revenue = DEMO_PAYMENTS.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount.replace(/[₦,]/g, "")), 0);
  return (
    <div>
      <h2 className="font-display text-2xl mb-1" style={{ color: C.ivory }}>Payments</h2>
      <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>
        Demo data — real transactions appear here once Paystack is connected at deploy.
      </p>

      <div className="p-5 mb-7" style={{ background: C.panel, border: `1px solid ${C.hairline}` }}>
        <p className="font-body text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: C.faint }}>Total Revenue</p>
        <p className="font-display text-4xl" style={{ color: C.ivory }}>₦{revenue.toLocaleString()}</p>
      </div>

      <div className="space-y-2">
        {DEMO_PAYMENTS.map((p) => (
          <div key={p.id} className="flex items-center justify-between py-4" style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}>
            <div>
              <p className="font-body text-[13.5px]" style={{ color: C.ivory }}>{p.buyer}</p>
              <p className="font-body text-[11.5px]" style={{ color: C.faint }}>{p.item} · {p.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-body text-[13.5px]" style={{ color: C.ivory }}>{p.amount}</span>
              <span className="flex items-center gap-1.5 font-body text-[11.5px] px-2.5 py-1" style={{
                color: p.status === "paid" ? C.good : C.warn,
                border: `1px solid ${p.status === "paid" ? C.good : C.warn}`,
              }}>
                {p.status === "paid" ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   AUDIENCE
--------------------------------------------------------------- */
const Audience = () => (
  <div>
    <h2 className="font-display text-2xl mb-1" style={{ color: C.ivory }}>Audience</h2>
    <p className="font-body text-[13px] mb-7" style={{ color: C.faint }}>
      Demo data — a real, live list populates here once a shared database (Supabase) is connected at deploy.
    </p>
    <div className="space-y-2">
      {DEMO_AUDIENCE.map((u, i) => (
        <div key={i} className="flex items-center justify-between py-4" style={{ borderBottom: `1px solid ${C.hairlineSoft}` }}>
          <div>
            <p className="font-body text-[13.5px]" style={{ color: C.ivory }}>{u.name}</p>
            <p className="font-body text-[11.5px]" style={{ color: C.faint }}>{u.email}</p>
          </div>
          <span className="font-body text-[12px]" style={{ color: C.faint }}>Joined {u.joined}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------
   ROOT
--------------------------------------------------------------- */
const NAV = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "upload", label: "Upload Content", Icon: UploadCloud },
  { id: "manage", label: "Manage Content", Icon: FolderOpen },
  { id: "payments", label: "Payments", Icon: CreditCard },
  { id: "audience", label: "Audience", Icon: Users },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [booted, setBooted] = useState(false);
  const [tab, setTab] = useState("overview");
  const [customContent, setCustomContent] = useState([]);
  const [engagement, setEngagement] = useState({});

  useEffect(() => {
    (async () => {
      const session = await safeGet("admin-session", false);
      if (session === "true") setAuthed(true);
      const stored = await safeGet("admin_content", true);
      if (stored) setCustomContent(JSON.parse(stored));
      setBooted(true);
    })();
  }, []);

  const allContent = [...DEFAULT_CONTENT, ...customContent];

  useEffect(() => {
    if (!authed) return;
    (async () => {
      const results = {};
      for (const item of allContent) {
        const raw = await safeGet(`engage_${item.id}`, true);
        results[item.id] = raw ? JSON.parse(raw) : { likes: 0, comments: [] };
      }
      setEngagement(results);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, customContent.length]);

  const handleLogin = async () => { setAuthed(true); await safeSet("admin-session", "true", false); };
  const handleLogout = async () => { setAuthed(false); await safeSet("admin-session", "", false); };

  const handleUpload = useCallback(async (item) => {
    setCustomContent((prev) => {
      const next = [...prev, item];
      safeSet("admin_content", JSON.stringify(next), true);
      return next;
    });
  }, []);

  const handleDelete = useCallback(async (id) => {
    setCustomContent((prev) => {
      const next = prev.filter((c) => c.id !== id);
      safeSet("admin_content", JSON.stringify(next), true);
      return next;
    });
  }, []);

  if (!booted) return <div style={{ background: C.bg, minHeight: "100vh" }} />;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <FontLoader />
      <style>{`
        .font-display { font-family: 'Playfair Display', serif; }
        .font-body { font-family: 'Outfit', sans-serif; }
        select option { background: ${C.panel}; }
      `}</style>

      {!authed ? (
        <AdminLogin onSuccess={handleLogin} />
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen">
          <aside className="md:w-[230px] shrink-0 md:min-h-screen p-5" style={{ background: C.panel, borderRight: `1px solid ${C.hairline}` }}>
            <p className="font-display text-lg mb-1" style={{ color: C.ivory }}>Oluwasogo Dosunmu</p>
            <p className="font-body text-[10.5px] tracking-[0.2em] uppercase mb-7" style={{ color: C.gold }}>Admin Panel</p>

            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setTab(n.id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 font-body text-[13px] whitespace-nowrap"
                  style={{
                    color: tab === n.id ? C.gold : C.ivoryDim,
                    background: tab === n.id ? "rgba(201,162,75,0.08)" : "transparent",
                    borderLeft: `2px solid ${tab === n.id ? C.gold : "transparent"}`,
                  }}
                >
                  <n.Icon size={15} /> {n.label}
                </button>
              ))}
            </nav>

            <button onClick={handleLogout} className="flex items-center gap-2 font-body text-[12px] mt-8" style={{ color: C.faint }}>
              <LogOut size={13} /> Log out
            </button>
          </aside>

          <main className="flex-1 p-6 md:p-10">
            {tab === "overview" && <Overview allContent={allContent} engagement={engagement} />}
            {tab === "upload" && <UploadContent onUpload={handleUpload} />}
            {tab === "manage" && <ManageContent allContent={allContent} engagement={engagement} onDelete={handleDelete} />}
            {tab === "payments" && <Payments />}
            {tab === "audience" && <Audience />}
          </main>
        </div>
      )}
    </div>
  );
}
