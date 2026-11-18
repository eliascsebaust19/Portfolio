import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { profile } from "@/data/profile";
import { useDeviceCapabilities } from "@/hooks/useReducedMotion";

const AvatarCanvas = lazy(() => import("./AvatarCanvas"));

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export type ModelStatus = "checking" | "ready" | "missing";

function StaticAvatarFallback({ status }: { status: ModelStatus }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center p-4">
      <div className="relative w-full max-w-[340px] overflow-hidden rounded-3xl border border-slate-800/90 bg-obsidian/80 shadow-[0_24px_80px_rgba(0,229,255,0.12)] backdrop-blur-sm">
        <img
          src={profile.avatar.fallbackImage}
          alt={profile.avatar.alt}
          className="h-auto w-full object-cover"
          loading="eager"
        />
        <div className="border-t border-slate-800/80 bg-void/90 px-4 py-3 text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-cyan">
            {status === "checking"
              ? "Checking 3D Asset..."
              : "Awaiting GLB Model Asset"}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">
            Configure at{" "}
            <code className="text-slate-200">{profile.avatar.glbPath}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Character3D() {
  const { canRender3D, reducedMotion } = useDeviceCapabilities();
  const [modelStatus, setModelStatus] = useState<ModelStatus>("checking");
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Verify the GLB binary file actually exists before invoking GLTFLoader
  // (Prevents Vite SPA fallback HTML from triggering Three.js parse errors)
  useEffect(() => {
    let cancelled = false;

    async function verifyGlbAsset() {
      try {
        const res = await fetch(profile.avatar.glbPath, {
          method: "GET",
          headers: { Range: "bytes=0-3" },
        });
        if (!res.ok) {
          if (!cancelled) setModelStatus("missing");
          return;
        }
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          if (!cancelled) setModelStatus("missing");
          return;
        }
        const buf = await res.arrayBuffer();
        const bytes = new Uint8Array(buf);
        // Binary glTF magic header: "glTF" (0x67, 0x6C, 0x54, 0x46)
        const isGlb =
          bytes.length >= 4 &&
          bytes[0] === 0x67 &&
          bytes[1] === 0x6c &&
          bytes[2] === 0x54 &&
          bytes[3] === 0x46;

        if (!cancelled) {
          setModelStatus(isGlb ? "ready" : "missing");
        }
      } catch {
        if (!cancelled) setModelStatus("missing");
      }
    }

    verifyGlbAsset();
    return () => {
      cancelled = true;
    };
  }, []);

  // Track pointer across window cleanly without blocking text or mobile touch
  useEffect(() => {
    if (reducedMotion) return;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerRef.current = { x: nx, y: ny };
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reducedMotion]);

  const staticFallback = <StaticAvatarFallback status={modelStatus} />;

  return (
    <div
      ref={containerRef}
      className="relative flex h-[380px] w-full items-center justify-center sm:h-[460px] lg:h-[580px]"
      style={{ touchAction: "pan-y" }}
    >
      {/* Ambient cinematic rim backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(0,229,255,0.16),rgba(124,58,237,0.08)_45%,transparent_72%)] blur-2xl"
      />

      {!canRender3D ? (
        staticFallback
      ) : (
        <ModelErrorBoundary fallback={staticFallback}>
          <Suspense fallback={staticFallback}>
            <div className="relative h-full w-full">
              <AvatarCanvas
                glbPath={profile.avatar.glbPath}
                hasGlbModel={modelStatus === "ready"}
                pointerRef={pointerRef}
                reducedMotion={reducedMotion}
              />

              {/* When GLB is not yet supplied, layer the honest static fallback card in front of the 3D calibration rings */}
              {modelStatus !== "ready" && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full max-w-[290px] overflow-hidden rounded-3xl border border-slate-700/70 bg-obsidian/75 shadow-[0_20px_60px_rgba(0,229,255,0.1)] backdrop-blur-md sm:max-w-[320px]">
                    <img
                      src={profile.avatar.fallbackImage}
                      alt={profile.avatar.alt}
                      className="h-auto w-full object-cover"
                      loading="eager"
                    />
                    <div className="border-t border-slate-800/90 bg-void/90 px-4 py-2.5 text-center">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                        {modelStatus === "checking"
                          ? "Checking 3D Model..."
                          : "3D Avatar Placeholder"}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                        Drop GLB at{" "}
                        <code className="text-slate-200">
                          {profile.avatar.glbPath}
                        </code>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Suspense>
        </ModelErrorBoundary>
      )}
    </div>
  );
}
