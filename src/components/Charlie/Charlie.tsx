import { useEffect, useRef, useState } from "react";
import { Download, Send, X } from "lucide-react";
import { projects } from "@/data/projects";
import { socialLinks } from "@/data/socialLinks";

interface ChatMessage {
  id: number;
  role: "user" | "charlie";
  text: string;
  link?: { label: string; href: string };
}

interface Reply {
  text: string;
  link?: { label: string; href: string };
}

const QUICK_REPLIES = [
  "Who is Elias?",
  "Projects",
  "Certificates",
  "Hackathon",
  "Skills",
  "Download CV",
  "Contact",
];

const WELCOME: ChatMessage = {
  id: 0,
  role: "charlie",
  text: "Hi! I'm Charlie, Elias's AI assistant. Ask me about his projects, skills, or how to reach him.",
};

function getReply(input: string): Reply {
  const q = input.toLowerCase();

  if (/\b(hi|hello|hey|hola|salam|assalam|yo)\b/.test(q)) {
    return { text: "Hello! Ask me about Elias's projects, skills, CV, or contact info." };
  }

  if (q.includes("cv") || q.includes("resume") || q.includes("download")) {
    return {
      text: "Here's Elias's CV — one page, ready to download.",
      link: { label: "Download CV (PDF)", href: "/cv/Elias-Ahmad-CV.pdf" },
    };
  }

  if (q.includes("project") || q.includes("work") || q.includes("built")) {
    const list = projects
      .map((p) => `• ${p.title} — ${p.shortDescription}`)
      .join("\n");
    return {
      text: `Elias's featured projects:\n${list}\n\nMore on GitHub:`,
      link: { label: "github.com/eliascsebaust19", href: socialLinks.githubUrl },
    };
  }

  if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("language")) {
    return {
      text: "Main stack: Flutter & Dart (mobile), React/Next.js (web), Node.js & PHP (backend), MySQL & PostgreSQL (databases).",
    };
  }

  if (q.includes("cert") || q.includes("bohubrihi") || q.includes("credential")) {
    return {
      text: "Elias holds a verified Certificate of Completion in 'Pathway to Software Engineering' from Bohubrihi (ID: 6aefe4db60143534454f7a38) and an AI Hackathon Certificate from DIU & Upay.",
      link: { label: "View Bohubrihi Certificate", href: "/certificates/bohubrihi-pathway-to-software-engineering.pdf" },
    };
  }

  if (q.includes("hackathon") || q.includes("diu") || q.includes("fest") || q.includes("upay") || q.includes("loading_211")) {
    return {
      text: "At the national AI Hackathon (AI Dev Fest 2026, DIU & Upay), Elias led Team Loading_211 to build Upay RiskIntel — an AI trust & fraud intelligence system. Both the certificate and live event photos are featured on the site!",
      link: { label: "View Hackathon Certificate", href: "/certificates/diu-ai-hackathon-2026-certificate.pdf" },
    };
  }

  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("intern") || q.includes("reach")) {
    return {
      text: `Best way to reach Elias: ${socialLinks.email}. He's open to internships and collaborations.`,
      link: { label: "Email Elias", href: `mailto:${socialLinks.email}` },
    };
  }

  if (q.includes("education") || q.includes("university") || q.includes("baust") || q.includes("study") || q.includes("student")) {
    return {
      text: "Elias is a CSE student at BAUST (Bangladesh Army University of Science and Technology).",
    };
  }

  if (q.includes("github")) {
    return {
      text: "All of Elias's code lives on GitHub.",
      link: { label: "github.com/eliascsebaust19", href: socialLinks.githubUrl },
    };
  }

  if (q.includes("linkedin")) {
    return {
      text: "Connect with Elias on LinkedIn.",
      link: { label: "Md Elias Ahmad", href: socialLinks.linkedinUrl },
    };
  }

  if (q.includes("who") || q.includes("about") || q.includes("elias")) {
    return {
      text: "Elias Ahmad — CSE student at BAUST and aspiring software engineer. He builds Flutter mobile apps and full-stack web projects.",
    };
  }

  if (q.includes("thank") || q.includes("shukriya") || q.includes("dhonnobad")) {
    return { text: "You're welcome! Anything else about Elias?" };
  }

  if (q.includes("charlie")) {
    return { text: "That's me! I'm Charlie — Elias's personal assistant on this portfolio." };
  }

  return {
    text: "I can help with Elias's projects, skills, CV, or contact info. Try one of the quick options below.",
  };
}

export function Charlie() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;

    setMessages((prev) => [...prev, { id: idRef.current++, role: "user", text }]);
    setInput("");
    setTyping(true);

    const reply = getReply(text);
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: idRef.current++, role: "charlie", text: reply.text, link: reply.link },
      ]);
      setTyping(false);
    }, 550 + Math.random() * 350);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-3 sm:bottom-6 sm:left-6">
      {/* Chat Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Charlie — AI assistant"
          className="flex h-[420px] w-[calc(100vw-2rem)] max-w-[340px] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-obsidian/95 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-800 bg-void/80 px-4 py-3">
            <img
              src="/images/brand/ea-logo-512.png"
              alt="Charlie"
              className="h-9 w-9 rounded-lg border border-cyan/30 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-slate-100">Charlie</p>
              <p className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                Elias&apos;s AI assistant
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Charlie"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              <X size={15} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-gradient-to-r from-cyan to-teal font-medium text-void"
                      : "rounded-bl-md border border-slate-800 bg-surface/80 text-slate-200"
                  }`}
                >
                  {msg.text}
                  {msg.link && (
                    <a
                      href={msg.link.href}
                      {...(msg.link.href.startsWith("http") || msg.link.href.startsWith("mailto")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : { download: "Elias-Ahmad-CV.pdf" })}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan/15 px-2.5 py-1.5 font-mono text-[11px] font-medium text-cyan transition-colors hover:bg-cyan/25"
                    >
                      <Download size={12} />
                      {msg.link.label}
                    </a>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-800 bg-surface/80 px-3.5 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="flex flex-wrap gap-1.5 border-t border-slate-800 px-3.5 py-2.5">
            {QUICK_REPLIES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => send(chip)}
                className="rounded-full border border-slate-700 bg-surface/70 px-2.5 py-1 font-mono text-[10px] text-slate-300 transition-colors hover:border-cyan/50 hover:text-cyan"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-slate-800 bg-void/80 px-3.5 py-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Charlie..."
              maxLength={200}
              aria-label="Message Charlie"
              className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-obsidian px-3 py-2 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-cyan focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan to-teal text-void transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Close Charlie" : "Chat with Charlie"}
        className="group relative flex items-center gap-2.5 rounded-2xl border border-cyan/30 bg-obsidian/90 py-2 pl-2 pr-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all hover:border-cyan/60"
      >
        <span className="relative">
          <img
            src="/images/brand/ea-logo-512.png"
            alt=""
            className="h-10 w-10 rounded-xl border border-cyan/30 object-cover"
          />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-obsidian bg-teal-400" />
        </span>
        <span className="text-left">
          <span className="block font-display text-[13px] font-bold leading-tight text-slate-100">
            Charlie
          </span>
          <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
            AI Assistant
          </span>
        </span>
      </button>
    </div>
  );
}
