import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const DATA_FILE = path.join(process.cwd(), "registrations.json");

function loadRegistrations(): object[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {
    // ignore
  }
  return [];
}

function saveRegistration(data: object) {
  const existing = loadRegistrations();
  existing.push({ ...data, registeredAt: new Date().toISOString() });
  fs.writeFileSync(DATA_FILE, JSON.stringify(existing, null, 2));
}

async function sendEmail(payload: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Corpus Fest <onboarding@resend.dev>",
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

router.post("/register", async (req, res) => {
  const { name, email, phone, college, events } = req.body;

  if (!name || !email || !phone || !college || !events) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const registration = { name, email, phone, college, events };

  // Store to file
  saveRegistration(registration);

  // Send confirmation email to participant
  await sendEmail({
    to: email,
    subject: "You're registered for Corpus 2026!",
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #1a0e04;">
        <h1 style="font-size: 2rem; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 8px;">Corpus 2026</h1>
        <p style="font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a96e; margin-bottom: 32px;">Registration Confirmed</p>
        <p style="font-size: 1rem; line-height: 1.7; margin-bottom: 24px;">Hi ${name},</p>
        <p style="font-size: 1rem; line-height: 1.7; margin-bottom: 24px;">
          Your registration for <strong>Corpus 2026</strong> has been received! We're excited to have you join us for four days of sports, arts, and culture at GMC Banswara.
        </p>
        <div style="background: #f5f0e8; border-radius: 6px; padding: 24px; margin-bottom: 28px;">
          <p style="font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: #8b7355; margin-bottom: 12px;">Your Details</p>
          <p style="margin: 4px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone}</p>
          <p style="margin: 4px 0;"><strong>College / Year:</strong> ${college}</p>
          <p style="margin: 4px 0;"><strong>Event Category:</strong> ${events}</p>
        </div>
        <p style="font-size: 0.9rem; line-height: 1.7; color: #555;">
          We'll reach out with event-specific instructions and schedules closer to the date. Stay tuned!
        </p>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0d4c3;" />
        <p style="font-size: 0.75rem; color: #999;">Corpus · GMC Banswara · 22–25 April 2026</p>
      </div>
    `,
  });

  // Send notification to organizer
  const organizerEmail = process.env.ORGANIZER_EMAIL || "ayushxbaranda@gmail.com";
  await sendEmail({
    to: organizerEmail,
    subject: `New Registration: ${name} — Corpus 2026`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; padding: 32px 24px; color: #1a0e04;">
        <h2 style="margin-bottom: 4px;">New Registration</h2>
        <p style="color: #c9a96e; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 24px;">Corpus 2026</p>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;">${email}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">College/Year</td><td style="padding: 8px 0;">${college}</td></tr>
          <tr><td style="padding: 8px 0; color: #666;">Events</td><td style="padding: 8px 0;">${events}</td></tr>
        </table>
      </div>
    `,
  });

  return res.json({ success: true, message: "Registration received!" });
});

// View all registrations (protected by a simple token)
router.get("/registrations", (req, res) => {
  const token = req.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Forbidden" });
  }
  return res.json(loadRegistrations());
});

export default router;
