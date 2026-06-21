"use client";

import { useState, useMemo } from "react";
import { IconChatBubble, IconClock, IconArrowRight } from "@/components/ui/Icons";
import { ALL_LEVELS, LEVEL_LABELS, LOCATIONS } from "@/lib/config";
import type { Level, Currency } from "@/types";

type NewPost = { title: string; body: string; category: string };

const CURRENCIES: Currency[] = ["INR", "USD", "GBP", "EUR"];

function AddSalaryModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    company: "", role: "", level: "SDE_II" as Level, location: "Bengaluru",
    currency: "INR" as Currency, experience_years: "",
    base_salary: "", bonus: "", stock: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading"); setError("");
    try {
      const res = await fetch("/api/ingest-salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.company, role: form.role, level: form.level,
          location: form.location, currency: form.currency,
          experience_years: parseInt(form.experience_years),
          base_salary: Number(form.base_salary),
          bonus: form.bonus ? Number(form.bonus) : 0,
          stock: form.stock ? Number(form.stock) : 0,
          source: "CONTRIBUTOR", confidence_score: 0.8,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message ?? "Failed"); }
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  const inputCls = "w-full border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F]";
  const labelCls = "text-xs font-medium text-[#484848] mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBEBEB]">
          <h2 className="text-lg font-bold text-[#222222]">Add Your Salary</h2>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222] text-xl leading-none">✕</button>
        </div>
        {status === "success" ? (
          <div className="p-10 text-center space-y-3">
            <div className="text-5xl">🎉</div>
            <p className="font-semibold text-[#222222]">Salary submitted!</p>
            <p className="text-sm text-[#717171]">Thank you for helping the community.</p>
            <button onClick={onClose} className="mt-2 px-5 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e04e53]">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Company *</label>
                <input required value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Google" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Role *</label>
                <input required value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Software Engineer" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Level *</label>
                <select value={form.level} onChange={(e) => set("level", e.target.value)} className={inputCls}>
                  {ALL_LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l as Level]}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Location *</label>
                <select value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls}>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Currency *</label>
                <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className={inputCls}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Years of Experience *</label>
                <input required type="number" min={1} max={50} value={form.experience_years} onChange={(e) => set("experience_years", e.target.value)} placeholder="e.g. 3" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Base Salary *</label>
                <input required type="number" min={1} value={form.base_salary} onChange={(e) => set("base_salary", e.target.value)} placeholder="e.g. 2000000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Bonus</label>
                <input type="number" min={0} value={form.bonus} onChange={(e) => set("bonus", e.target.value)} placeholder="e.g. 300000" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Stock (annual)</label>
                <input type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="e.g. 500000" className={inputCls} />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={status === "loading"} className="flex-1 py-2.5 bg-[#FF5A5F] text-white text-sm font-medium rounded-lg hover:bg-[#e04e53] disabled:opacity-60 transition-colors">
                {status === "loading" ? "Submitting…" : "Submit Anonymously"}
              </button>
              <button type="button" onClick={onClose} className="px-4 py-2.5 border border-[#EBEBEB] text-sm text-[#484848] rounded-lg hover:bg-[#F7F7F7]">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function NewPostModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (p: NewPost) => void }) {
  const [form, setForm] = useState<NewPost>({ title: "", body: "", category: "Career" });
  const set = (k: keyof NewPost, v: string) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#222222]">New Post</h2>
          <button onClick={onClose} className="text-[#717171] hover:text-[#222222] text-xl leading-none">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#484848] mb-1 block">Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F]"
            >
              {["Salaries", "Offers", "Career", "Culture"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#484848] mb-1 block">Title</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="What's your question or topic?"
              className="w-full border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm text-[#222222] focus:outline-none focus:border-[#FF5A5F]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#484848] mb-1 block">Details</label>
            <textarea
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder="Share more context..."
              rows={4}
              className="w-full border border-[#EBEBEB] rounded-lg px-3 py-2 text-sm text-[#222222] resize-none focus:outline-none focus:border-[#FF5A5F]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-[#717171] hover:text-[#222222] transition-colors">Cancel</button>
          <button
            onClick={() => { if (form.title.trim() && form.body.trim()) { onSubmit(form); onClose(); } }}
            className="px-4 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-xl hover:bg-[#e84f54] transition-colors"
          >
            Post Anonymously
          </button>
        </div>
      </div>
    </div>
  );
}

const POSTS = [
  { id: 1, company: "Amazon", title: "Is Amazon's PIP culture as bad as they say?", body: "Just got pinged by an Amazon recruiter. Been hearing a lot about performance management there. Anyone have first-hand experience from 2024 onwards?", upvotes: 142, replies: 38, time: "2h ago", tags: ["culture", "PIP"], category: "Culture", hot: true },
  { id: 2, company: "Google", title: "L4 → L5 promotion at Google India — how long?", body: "I'm currently L4 at Google Bengaluru, 2 years in. What's the typical timeline to L5? Any tips on what reviewers look for in a promo packet?", upvotes: 89, replies: 24, time: "5h ago", tags: ["promotion", "career"], category: "Career", hot: true },
  { id: 3, company: null, title: "Flipkart vs Meesho for SDE-II — which is better for growth?", body: "Got offers from both. Meesho is 15% higher TC but Flipkart has better brand value. Long-term career wise which makes more sense in 2025?", upvotes: 203, replies: 61, time: "1d ago", tags: ["offer", "comparison"], category: "Offers", hot: true },
  { id: 4, company: "TCS", title: "How to negotiate a 50% hike when switching from TCS?", body: "I have 3 years in TCS at 12 LPA. Got a startup offer at 18 LPA. Is 20 LPA achievable at this stage? How do I approach the negotiation without losing the offer?", upvotes: 316, replies: 89, time: "2d ago", tags: ["negotiation", "switching"], category: "Salaries", hot: true },
  { id: 5, company: "NVIDIA", title: "NVIDIA Bengaluru — compensation breakdown for SDE", body: "What does total compensation look like for a software engineer at NVIDIA Bengaluru? Especially the ESOP component and vesting cliff.", upvotes: 178, replies: 42, time: "3d ago", tags: ["compensation", "ESOP"], category: "Salaries", hot: false },
  { id: 6, company: null, title: "Is a 30% hike justified when moving from service to product?", body: "Service company offering 30% hike to stay vs product startup at current CTC. Which is the smarter long-term move for someone 4 years into their career?", upvotes: 95, replies: 29, time: "4d ago", tags: ["switching", "service-to-product"], category: "Career", hot: false },
  { id: 7, company: "Zepto", title: "Zepto's engineering culture post Series F — any insiders?", body: "Considering an offer from Zepto. Wanted to understand the engineering culture, on-call pressure, and growth opportunities at their current scale.", upvotes: 67, replies: 18, time: "5d ago", tags: ["culture", "startup"], category: "Culture", hot: false },
  { id: 8, company: null, title: "Two-body problem: spouse in Mumbai, job in Bengaluru. Worth it?", body: "Got a 50% hike offer in Bengaluru but my partner works in Mumbai. Anyone navigated a similar situation? Is remote negotiable at product companies?", upvotes: 251, replies: 73, time: "1w ago", tags: ["remote", "WLB"], category: "Culture", hot: false },
];

const CATEGORIES = ["All", "Salaries", "Offers", "Career", "Culture"] as const;
type Category = (typeof CATEGORIES)[number];
type SortMode = "Hot" | "New";

const TRENDING_TOPICS: { label: string; category: Category }[] = [
  { label: "Mass layoffs 2025", category: "Culture" },
  { label: "ESOP vs cash bonus", category: "Salaries" },
  { label: "Service to product switch", category: "Career" },
  { label: "PIP survival guide", category: "Culture" },
  { label: "Bengaluru vs Hyderabad", category: "Career" },
  { label: "SDE-II to SDE-III", category: "Career" },
];

export function CommunityFeed() {
  const [category, setCategory] = useState<Category>("All");
  const [sortMode, setSortMode] = useState<SortMode>("Hot");
  const [upvoted, setUpvoted] = useState<Set<number>>(new Set());
  const [showNewPost, setShowNewPost] = useState(false);
  const [showAddSalary, setShowAddSalary] = useState(false);
  const [posts, setPosts] = useState(POSTS);
  const [votes, setVotes] = useState<Record<number, number>>(
    Object.fromEntries(POSTS.map((p) => [p.id, p.upvotes]))
  );

  const handleNewPost = (p: NewPost) => {
    const id = Date.now();
    setPosts((prev) => [{ id, company: null, title: p.title, body: p.body, upvotes: 0, replies: 0, time: "just now", tags: [], category: p.category as Category, hot: false }, ...prev]);
    setVotes((v) => ({ ...v, [id]: 0 }));
  };

  const handleUpvote = (id: number) => {
    setUpvoted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setVotes((v) => ({ ...v, [id]: v[id] - 1 }));
      } else {
        next.add(id);
        setVotes((v) => ({ ...v, [id]: v[id] + 1 }));
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = category === "All" ? posts : posts.filter((p) => p.category === category);
    if (sortMode === "Hot") list = [...list].sort((a, b) => votes[b.id] - votes[a.id]);
    else list = [...list].sort((a, b) => a.id - b.id); // New = original insert order
    return list;
  }, [category, sortMode, votes]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} onSubmit={handleNewPost} />}
      {showAddSalary && <AddSalaryModal onClose={() => setShowAddSalary(false)} />}
      {/* Main feed */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <span />
          <button
            onClick={() => setShowNewPost(true)}
            className="px-4 py-2 bg-[#FF5A5F] text-white text-sm font-medium rounded-xl hover:bg-[#e84f54] transition-colors"
          >
            New Post
          </button>
        </div>

        <div className="bg-[#FFF5F5] border border-[#FFE0E0] rounded-xl p-4 mb-4 text-sm text-[#717171] flex items-center gap-3">
          <span className="shrink-0 w-8 h-8 rounded-full bg-[#FF5A5F] flex items-center justify-center text-white text-xs font-bold">A</span>
          <div>
            <span className="font-medium text-[#222222]">All posts are anonymous.</span>
            {" "}Share your salary, ask about offers, discuss company culture — no names, no judgment.
          </div>
        </div>

        {/* Filters row */}
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? "bg-[#FF5A5F] text-white"
                    : "bg-white border border-[#EBEBEB] text-[#484848] hover:border-[#FF5A5F] hover:text-[#FF5A5F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-0 bg-white border border-[#EBEBEB] rounded-lg overflow-hidden">
            {(["Hot", "New"] as SortMode[]).map((s) => (
              <button
                key={s}
                onClick={() => setSortMode(s)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  sortMode === s ? "bg-[#FF5A5F] text-white" : "text-[#717171] hover:bg-[#F7F7F7]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#717171]">No posts in this category yet.</div>
        )}

        <div className="space-y-3">
          {filtered.map((post) => (
            <div key={post.id} className="bg-white border border-[#EBEBEB] rounded-xl p-5 hover:border-[#FF5A5F] transition-colors group">
              <div className="flex items-start gap-3">
                {/* Vote */}
                <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className={`p-1 rounded transition-colors ${upvoted.has(post.id) ? "text-[#FF5A5F]" : "text-[#717171] hover:text-[#FF5A5F]"}`}
                  >
                    <svg className="w-4 h-4" fill={upvoted.has(post.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <span className={`text-sm font-bold ${upvoted.has(post.id) ? "text-[#FF5A5F]" : "text-[#222222]"}`}>
                    {votes[post.id]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {post.company && (
                      <span className="text-xs px-2 py-0.5 bg-[#fff5f5] text-[#FF5A5F] border border-[#FFE0E0] rounded-full font-medium">{post.company}</span>
                    )}
                    <span className="text-xs px-2 py-0.5 bg-[#F7F7F7] text-[#717171] rounded-full border border-[#EBEBEB]">{post.category}</span>
                    {post.hot && sortMode === "Hot" && (
                      <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full font-medium">🔥 Hot</span>
                    )}
                  </div>
                  <h3
                    className="font-semibold text-[#222222] group-hover:text-[#FF5A5F] transition-colors mb-1 cursor-pointer"
                    onClick={() => setCategory(post.category as Category)}
                  >{post.title}</h3>
                  <p className="text-sm text-[#717171] line-clamp-2">{post.body}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[#717171]">
                    <span className="flex items-center gap-1"><IconChatBubble className="w-3.5 h-3.5" /> {post.replies} replies</span>
                    <span className="flex items-center gap-1"><IconClock className="w-3.5 h-3.5" /> {post.time}</span>
                    {post.tags.map((t) => (
                      <span key={t} className="hidden sm:inline px-2 py-0.5 bg-[#F7F7F7] rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:w-72 shrink-0 space-y-4">
        {/* Trending topics — visible on mobile as horizontal scroll */}
        <div className="bg-white border border-[#EBEBEB] rounded-xl p-4">
          <h3 className="font-semibold text-[#222222] mb-3 text-sm">Trending Topics</h3>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {TRENDING_TOPICS.map((topic, i) => (
              <button
                key={topic.label}
                onClick={() => setCategory(topic.category)}
                className="shrink-0 lg:shrink text-left flex items-center gap-2 text-sm text-[#484848] hover:text-[#FF5A5F] cursor-pointer transition-colors px-3 py-1.5 lg:px-0 lg:py-0 bg-[#F7F7F7] lg:bg-transparent rounded-full lg:rounded-none border border-[#EBEBEB] lg:border-0"
              >
                <span className="text-xs text-[#717171] w-4 shrink-0 hidden lg:inline">#{i + 1}</span>
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:block bg-white border border-[#EBEBEB] rounded-xl p-5">
          <h3 className="font-semibold text-[#222222] mb-3 text-sm">Community Guidelines</h3>
          <ul className="space-y-1.5 text-xs text-[#717171]">
            {["Be anonymous — no real names.", "Be specific — vague posts get less traction.", "Be respectful — no company bashing.", "Share data — numbers > opinions."].map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="text-[#FF5A5F] mt-0.5 shrink-0">•</span> {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden lg:block bg-[#222222] rounded-xl p-5">
          <h3 className="font-semibold text-white text-sm mb-2">Add your salary</h3>
          <p className="text-xs text-[#717171] mb-4 leading-relaxed">Help the community. Share your compensation anonymously.</p>
          <button onClick={() => setShowAddSalary(true)} className="inline-flex items-center gap-1.5 text-xs text-white font-medium bg-[#FF5A5F] px-3 py-2 rounded-lg hover:bg-[#e84f54] transition-colors">
            Contribute <IconArrowRight className="w-3 h-3" />
          </button>
        </div>
        {/* Add salary CTA — mobile only */}
        <button
          onClick={() => setShowAddSalary(true)}
          className="lg:hidden w-full py-3 bg-[#222222] text-white text-sm font-medium rounded-xl hover:bg-[#333] transition-colors"
        >
          + Add Your Salary Anonymously
        </button>
      </div>
    </div>
  );
}
