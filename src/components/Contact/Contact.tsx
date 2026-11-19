import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Mail,
  MapPin,
  Send,
  ShieldCheck,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import { socialLinks } from "@/data/socialLinks";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string; // honeypot
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [openedAt, setOpenedAt] = useState<number>(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  useEffect(() => {
    setOpenedAt(Date.now());
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".contact-reveal",
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const validateClient = (): string | null => {
    if (form.name.trim().length < 2) {
      return "Please enter your name (at least 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }
    if (form.subject.trim().length < 3) {
      return "Please enter a subject (at least 3 characters).";
    }
    if (form.message.trim().length < 10) {
      return "Please write a message of at least 10 characters.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateClient();
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const endpoint =
        import.meta.env.VITE_FORMSPREE_ENDPOINT || "/api/contact";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          website: form.website,
          submittedAt: openedAt,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!res.ok || data.ok === false) {
        throw new Error(
          data.error || "Failed to send message. Please try again."
        );
      }

      setStatus({
        type: "success",
        message:
          data.message ||
          "Thank you for reaching out! Your message has been sent.",
      });
      setForm(INITIAL_FORM);
      setOpenedAt(Date.now());
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong while sending your message.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative bg-obsidian py-16 sm:py-20"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="contact-reveal mb-8 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">
            07 // Contact
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-50 sm:text-3xl">
            Let&apos;s Connect
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Project idea or question? Send a message or reach me directly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Contact Info Panel */}
          <div className="contact-reveal space-y-4 lg:col-span-5">
            <a
              href={`mailto:${socialLinks.email}`}
              className="group flex items-start gap-4 rounded-2xl border border-slate-800/90 bg-void/80 p-5 transition-colors hover:border-cyan/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <Mail size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Email
                </p>
                <p className="mt-1 truncate font-display text-base font-semibold text-slate-100 group-hover:text-cyan">
                  {socialLinks.email}
                </p>
              </div>
            </a>

            <a
              href={socialLinks.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-slate-800/90 bg-void/80 p-5 transition-colors hover:border-cyan/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <FaGithub size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  GitHub
                </p>
                <p className="mt-1 truncate font-display text-base font-semibold text-slate-100 group-hover:text-cyan">
                  github.com/{socialLinks.githubUsername}
                </p>
              </div>
            </a>

            <a
              href={socialLinks.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-slate-800/90 bg-void/80 p-5 transition-colors hover:border-cyan/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
                <FaLinkedinIn size={19} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  LinkedIn
                </p>
                <p className="mt-1 truncate font-display text-base font-semibold text-slate-100 group-hover:text-cyan">
                  Md Elias Ahmad
                </p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-slate-800/90 bg-void/80 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal-400">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Location
                </p>
                <p className="mt-1 font-display text-base font-semibold text-slate-100">
                  BAUST · {socialLinks.location}
                </p>
              </div>
            </div>

            <a
              href="/cv/Elias-Ahmad-CV.pdf"
              download="Elias-Ahmad-CV.pdf"
              className="group flex items-start gap-4 rounded-2xl border border-teal/30 bg-teal/5 p-5 transition-colors hover:border-teal/50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-teal-400">
                <Download size={20} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
                  Resume
                </p>
                <p className="mt-1 font-display text-base font-semibold text-slate-100 group-hover:text-teal-300">
                  Download CV (PDF)
                </p>
              </div>
            </a>
          </div>

          {/* Contact Form */}
          <div className="contact-reveal lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-3xl border border-slate-800/90 bg-void/85 p-6 sm:p-8"
            >
              {/* Honeypot anti-spam trap (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, website: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block font-mono text-xs uppercase tracking-wider text-slate-300"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-800 bg-obsidian px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block font-mono text-xs uppercase tracking-wider text-slate-300"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    maxLength={160}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full rounded-xl border border-slate-800 bg-obsidian px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-subject"
                  className="mb-2 block font-mono text-xs uppercase tracking-wider text-slate-300"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  maxLength={150}
                  placeholder="Project inquiry, collaboration, or hello"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-800 bg-obsidian px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="contact-message"
                  className="mb-2 block font-mono text-xs uppercase tracking-wider text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  maxLength={3000}
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full resize-y rounded-xl border border-slate-800 bg-obsidian px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan focus:outline-none"
                />
              </div>

              {/* Status Feedback */}
              {status.type !== "idle" && (
                <div
                  role={status.type === "error" ? "alert" : "status"}
                  className={`mt-5 flex items-start gap-3 rounded-xl border p-4 text-sm ${
                    status.type === "success"
                      ? "border-teal/40 bg-teal/10 text-teal-300"
                      : "border-rose-500/40 bg-rose-500/10 text-rose-300"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex items-center gap-2 font-mono text-[11px] text-slate-500">
                  <ShieldCheck size={14} className="text-teal-400" />
                  <span>Protected with validation &amp; anti-spam checks</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-teal px-6 py-3 font-display text-sm font-semibold text-void shadow-[0_10px_25px_rgba(0,229,255,0.18)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />
                  <span>{submitting ? "Sending..." : "Send Message"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
