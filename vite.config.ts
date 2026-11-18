import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import type { IncomingMessage, ServerResponse } from "http";

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
  submittedAt?: number;
}

function contactDevMiddleware(): Plugin {
  return {
    name: "contact-api-dev-middleware",
    configureServer(server) {
      server.middlewares.use(
        "/api/contact",
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== "POST") {
            if (req.method === "OPTIONS") {
              res.statusCode = 204;
              res.end();
              return;
            }
            next();
            return;
          }

          let rawBody = "";
          req.on("data", (chunk: Buffer) => {
            rawBody += chunk.toString("utf-8");
            if (rawBody.length > 25_000) {
              res.statusCode = 413;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ ok: false, error: "Payload too large." })
              );
              req.destroy();
            }
          });

          req.on("end", async () => {
            res.setHeader("Content-Type", "application/json");
            try {
              const body = JSON.parse(rawBody || "{}") as ContactPayload;

              // Honeypot spam protection
              if (body.website && body.website.trim().length > 0) {
                res.statusCode = 400;
                res.end(
                  JSON.stringify({
                    ok: false,
                    error: "Spam check triggered.",
                  })
                );
                return;
              }

              // Minimum human interaction time check (1.5s)
              if (
                typeof body.submittedAt === "number" &&
                Date.now() - body.submittedAt < 1200
              ) {
                res.statusCode = 429;
                res.end(
                  JSON.stringify({
                    ok: false,
                    error: "Please take a moment before submitting the form.",
                  })
                );
                return;
              }

              const name = (body.name || "").trim();
              const email = (body.email || "").trim();
              const subject = (body.subject || "").trim();
              const message = (body.message || "").trim();

              if (name.length < 2 || name.length > 100) {
                res.statusCode = 400;
                res.end(
                  JSON.stringify({
                    ok: false,
                    error: "Please enter a valid name (2–100 characters).",
                  })
                );
                return;
              }

              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
              if (!emailRegex.test(email) || email.length > 160) {
                res.statusCode = 400;
                res.end(
                  JSON.stringify({
                    ok: false,
                    error: "Please provide a valid email address.",
                  })
                );
                return;
              }

              if (subject.length < 3 || subject.length > 150) {
                res.statusCode = 400;
                res.end(
                  JSON.stringify({
                    ok: false,
                    error: "Subject must be between 3 and 150 characters.",
                  })
                );
                return;
              }

              if (message.length < 10 || message.length > 3000) {
                res.statusCode = 400;
                res.end(
                  JSON.stringify({
                    ok: false,
                    error: "Message must be between 10 and 3000 characters.",
                  })
                );
                return;
              }

              const resendKey = process.env.RESEND_API_KEY;
              const recipient =
                process.env.CONTACT_RECIPIENT_EMAIL || "eliascse19@gmail.com";

              if (resendKey) {
                const resendRes = await fetch("https://api.resend.com/emails", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${resendKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    from:
                      process.env.RESEND_FROM_EMAIL ||
                      "Portfolio Contact <onboarding@resend.dev>",
                    to: [recipient],
                    reply_to: email,
                    subject: `[Portfolio] ${subject}`,
                    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
                  }),
                });
                if (!resendRes.ok) {
                  res.statusCode = 502;
                  res.end(
                    JSON.stringify({
                      ok: false,
                      error:
                        "Email delivery service returned an error. Please try again later.",
                    })
                  );
                  return;
                }
              }

              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  ok: true,
                  mode: resendKey ? "email-dispatched" : "validated-sandbox",
                  message:
                    "Thank you! Your message has been validated and received.",
                })
              );
            } catch {
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  ok: false,
                  error: "Invalid request format.",
                })
              );
            }
          });
        }
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), contactDevMiddleware()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    cors: true,
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "three-core": ["three"],
          "r3f-vendor": ["@react-three/fiber", "@react-three/drei"],
          "gsap-vendor": ["gsap", "@gsap/react"],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
});
