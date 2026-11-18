import type { IncomingMessage, ServerResponse } from "http";

interface VercelRequest extends IncomingMessage {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
}

interface ContactBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string;
  submittedAt?: number;
}

const rateMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: VercelRequest): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string") return fwd.split(",")[0].trim();
  if (Array.isArray(fwd) && fwd.length > 0) return fwd[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed." });
    return;
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.status(429).json({
      ok: false,
      error: "Too many requests. Please wait a minute and try again.",
    });
    return;
  }

  let body: ContactBody = {};
  if (typeof req.body === "object" && req.body !== null) {
    body = req.body as ContactBody;
  } else if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body) as ContactBody;
    } catch {
      res.status(400).json({ ok: false, error: "Invalid JSON body." });
      return;
    }
  }

  // Honeypot spam protection
  if (body.website && body.website.trim().length > 0) {
    res.status(400).json({ ok: false, error: "Spam check triggered." });
    return;
  }

  // Minimum time-to-submit check (anti-bot)
  if (
    typeof body.submittedAt === "number" &&
    Date.now() - body.submittedAt < 1200
  ) {
    res.status(429).json({
      ok: false,
      error: "Please take a moment before submitting the form.",
    });
    return;
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const subject = (body.subject || "").trim();
  const message = (body.message || "").trim();

  if (name.length < 2 || name.length > 100) {
    res.status(400).json({
      ok: false,
      error: "Please enter your name (2–100 characters).",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email) || email.length > 160) {
    res.status(400).json({
      ok: false,
      error: "Please enter a valid email address.",
    });
    return;
  }

  if (subject.length < 3 || subject.length > 150) {
    res.status(400).json({
      ok: false,
      error: "Subject must be between 3 and 150 characters.",
    });
    return;
  }

  if (message.length < 10 || message.length > 3000) {
    res.status(400).json({
      ok: false,
      error: "Message must be between 10 and 3000 characters.",
    });
    return;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
  const recipient =
    process.env.CONTACT_RECIPIENT_EMAIL || "eliascse19@gmail.com";

  try {
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
        res.status(502).json({
          ok: false,
          error: "Unable to dispatch email at the moment. Please try again.",
        });
        return;
      }

      res.status(200).json({
        ok: true,
        mode: "email-dispatched",
        message: "Thank you! Your message has been sent to Elias Ahmad.",
      });
      return;
    }

    if (formspreeEndpoint) {
      const fsRes = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!fsRes.ok) {
        res.status(502).json({
          ok: false,
          error: "Email forwarding failed. Please try again later.",
        });
        return;
      }

      res.status(200).json({
        ok: true,
        mode: "email-dispatched",
        message: "Thank you! Your message has been forwarded.",
      });
      return;
    }

    // Fallback when deployed without mail provider env vars configured yet
    res.status(200).json({
      ok: true,
      mode: "validated-only",
      message:
        "Message validated successfully. Configure RESEND_API_KEY or FORMSPREE_ENDPOINT in environment variables to deliver directly to inbox.",
    });
  } catch {
    res.status(500).json({
      ok: false,
      error: "Unexpected server error. Please try again later.",
    });
  }
}
