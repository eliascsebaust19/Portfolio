import { useRef, useState, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Sparkles,
  X,
} from "lucide-react";
import { gsap, useGSAP } from "@/animations/gsapConfig";
import {
  certificates,
  hackathonGallery,
  type CertificateItem,
} from "@/data/credentials";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Credentials() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const [activeCertModal, setActiveCertModal] =
    useState<CertificateItem | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [photoFilter, setPhotoFilter] = useState<string>("All");

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.fromTo(
        ".credential-card",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.14,
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

  // Keyboard navigation for modal & lightbox
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCertModal(null);
        setActivePhotoIndex(null);
      } else if (activePhotoIndex !== null) {
        if (e.key === "ArrowLeft") {
          setActivePhotoIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : hackathonGallery.length - 1
          );
        } else if (e.key === "ArrowRight") {
          setActivePhotoIndex((prev) =>
            prev !== null && prev < hackathonGallery.length - 1 ? prev + 1 : 0
          );
        }
      }
    };

    if (activeCertModal || activePhotoIndex !== null) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeCertModal, activePhotoIndex]);

  const filteredPhotos =
    photoFilter === "All"
      ? hackathonGallery
      : hackathonGallery.filter((item) => item.category === photoFilter);

  return (
    <section
      id="credentials"
      ref={sectionRef}
      className="relative bg-void py-20 sm:py-24"
    >
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">
            06 // Verified Credentials &amp; Honors
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-slate-50 sm:text-3xl">
            Certifications &amp; Hackathon Achievements
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-[13px]">
            Official certifications in software engineering and national
            hackathon achievements representing BAUST at AI Dev Fest 2026.
          </p>
        </div>

        {/* 2-Column Certificate Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {certificates.map((cert) => (
            <article
              key={cert.id}
              className="credential-card group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/90 bg-obsidian/90 p-5 transition-all duration-300 hover:border-cyan/40 sm:p-6"
            >
              <div>
                {/* Certificate Preview Image */}
                <div
                  onClick={() => setActiveCertModal(cert)}
                  className="relative aspect-[16/11] cursor-pointer overflow-hidden rounded-xl border border-slate-800/80 bg-void"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-void/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-void/90 px-3 py-1.5 font-mono text-xs text-cyan">
                      <Eye size={14} />
                      <span>View Full Certificate</span>
                    </span>
                  </div>

                  <div className="absolute left-3 top-3">
                    <span className="rounded-md border border-cyan/35 bg-void/85 px-2 py-0.5 font-mono text-[10px] text-cyan backdrop-blur-sm">
                      {cert.badgeText}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-[11px] text-teal-400">
                      {cert.issuer}
                    </p>
                    <span className="font-mono text-[10px] text-slate-400">
                      {cert.date}
                    </span>
                  </div>

                  <h3 className="mt-1 font-display text-lg font-bold text-slate-50 sm:text-xl">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-400">{cert.issuerOrg}</p>

                  {cert.credentialId && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-300">
                      <CheckCircle2 size={12} className="text-emerald-400" />
                      <span>ID: {cert.credentialId}</span>
                    </div>
                  )}

                  <p className="mt-3 text-xs leading-relaxed text-slate-300 sm:text-[13px]">
                    {cert.description}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-slate-800 bg-surface/80 px-2 py-0.5 font-mono text-[10px] text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-slate-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveCertModal(cert)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan/15 px-3 py-2 font-display text-xs font-semibold text-cyan transition-colors hover:bg-cyan/25"
                >
                  <Eye size={14} />
                  <span>View Preview</span>
                </button>

                <a
                  href={cert.pdfUrl}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-surface px-3 py-2 font-mono text-xs text-slate-200 transition-colors hover:border-cyan/40 hover:text-cyan"
                >
                  <Download size={13} />
                  <span>Download PDF</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Hackathon Moments Showcase */}
        <div className="mt-16">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-teal-400" />
                <h3 className="font-display text-xl font-bold text-slate-50">
                  DIU AI Dev Fest 2026 — Live Hackathon Gallery
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Snapshots of Team Loading_211 in action, software workstation, and judge verification.
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-1.5">
              {(["All", "Software", "Team", "Official", "Event"] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPhotoFilter(cat)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[11px] transition-colors ${
                      photoFilter === cat
                        ? "border border-cyan/50 bg-cyan/15 text-cyan font-medium"
                        : "border border-slate-800 bg-obsidian text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
            {filteredPhotos.map((photo) => {
              const originalIndex = hackathonGallery.findIndex(
                (p) => p.id === photo.id
              );
              return (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoIndex(originalIndex)}
                  className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border border-slate-800/90 bg-obsidian transition-all duration-300 hover:border-cyan/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />

                  <div className="absolute inset-x-0 bottom-0 p-2.5">
                    <span className="rounded bg-void/80 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan backdrop-blur-sm">
                      {photo.category}
                    </span>
                    <h4 className="mt-1 line-clamp-1 font-display text-xs font-semibold text-slate-200">
                      {photo.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {activeCertModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/90 p-4 backdrop-blur-md sm:p-6"
          onClick={() => setActiveCertModal(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-800 bg-obsidian shadow-[0_28px_90px_rgba(0,0,0,0.8)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800/80 bg-obsidian/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Award size={18} className="text-cyan" />
                <span className="font-display text-sm font-semibold text-slate-100">
                  {activeCertModal.title}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveCertModal(null)}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-surface text-slate-300 transition-colors hover:border-cyan/40 hover:text-cyan"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* High-res Image */}
              <div className="overflow-hidden rounded-2xl border border-slate-800 bg-void">
                <img
                  src={activeCertModal.image}
                  alt={activeCertModal.title}
                  className="h-auto w-full object-contain"
                />
              </div>

              {/* Metadata */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-50">
                    {activeCertModal.title}
                  </h3>
                  <p className="mt-1 text-sm text-teal-400">
                    {activeCertModal.issuer} · {activeCertModal.issuerOrg}
                  </p>
                  <p className="mt-1 font-mono text-xs text-slate-400">
                    Issue Date: {activeCertModal.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={activeCertModal.pdfUrl}
                    download
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan to-teal px-4 py-2.5 text-sm font-semibold text-void transition-opacity hover:opacity-90 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                  >
                    <Download size={15} />
                    <span>Download Official PDF</span>
                  </a>
                </div>
              </div>

              {/* Signatories */}
              {activeCertModal.signatories && (
                <div className="mt-6 rounded-xl border border-slate-800/80 bg-void/60 p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                    Verified Signatories
                  </p>
                  <ul className="mt-2 space-y-1">
                    {activeCertModal.signatories.map((sig, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-300"
                      >
                        <FileText size={13} className="text-cyan" />
                        <span>{sig}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Hackathon Photos */}
      {activePhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-void/95 p-4 backdrop-blur-lg sm:p-8"
          onClick={() => setActivePhotoIndex(null)}
        >
          <div
            className="relative flex max-h-[90vh] max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActivePhotoIndex(null)}
              aria-label="Close lightbox"
              className="absolute -top-12 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-obsidian text-slate-200 transition-colors hover:border-cyan hover:text-cyan"
            >
              <X size={18} />
            </button>

            {/* Main Photo */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-obsidian shadow-2xl">
              <img
                src={hackathonGallery[activePhotoIndex].image}
                alt={hackathonGallery[activePhotoIndex].title}
                className="max-h-[72vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Caption */}
            <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 px-2 text-center sm:text-left">
              <div>
                <span className="rounded bg-cyan/15 px-2 py-0.5 font-mono text-[10px] uppercase text-cyan">
                  {hackathonGallery[activePhotoIndex].category}
                </span>
                <h4 className="mt-1 font-display text-base font-bold text-slate-100">
                  {hackathonGallery[activePhotoIndex].title}
                </h4>
                <p className="mt-0.5 text-xs text-slate-400">
                  {hackathonGallery[activePhotoIndex].caption}
                </p>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev !== null && prev > 0
                        ? prev - 1
                        : hackathonGallery.length - 1
                    )
                  }
                  aria-label="Previous photo"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-surface text-slate-300 transition-colors hover:border-cyan/50 hover:text-cyan"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="font-mono text-xs text-slate-400">
                  {activePhotoIndex + 1} / {hackathonGallery.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActivePhotoIndex((prev) =>
                      prev !== null && prev < hackathonGallery.length - 1
                        ? prev + 1
                        : 0
                    )
                  }
                  aria-label="Next photo"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-surface text-slate-300 transition-colors hover:border-cyan/50 hover:text-cyan"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
