import nodemailer from "nodemailer";
import path from "path";
import fs from "fs/promises";

type SendPdfOptions = {
  downloadUrl?: string;
};

export async function sendPDF(email: string, options: SendPdfOptions = {}) {
  const emailUser = process.env.EMAIL_USER;
  const rawEmailPass = process.env.EMAIL_PASS;

  if (!emailUser || !rawEmailPass) {
    throw new Error("EMAIL_USER/EMAIL_PASS is missing (required for SMTP auth).");
  }

  // Secure SMTP defaults (overrideable via env if needed).
  const smtpHost = process.env.EMAIL_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.EMAIL_PORT || "465");
  const smtpSecure = (process.env.EMAIL_SECURE || "").toLowerCase() === "true" || smtpPort === 465;

  // Gmail app passwords are often copied with spaces; normalize only for Gmail SMTP.
  const emailPass = smtpHost.includes("gmail.com")
    ? rawEmailPass.replace(/\s+/g, "")
    : rawEmailPass;

  if (smtpHost.includes("gmail.com") && rawEmailPass !== emailPass) {
    console.log("[sendPDF] normalized EMAIL_PASS whitespace for Gmail SMTP");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    // For port 587, STARTTLS is used; for 465, the connection is already TLS.
    requireTLS: !smtpSecure,
    tls: {
      minVersion: "TLSv1.2",
    },
  });

  try {
    await transporter.verify();
    console.log("[sendPDF] SMTP verified");
  } catch (err: any) {
    console.error("[sendPDF] SMTP verify failed", {
      message: err?.message,
      stack: err?.stack,
    });
    throw err;
  }

  // Attach the PDF from `public/` so the email contains the actual file.
  const pdfPath = path.join(process.cwd(), "public", "_Lead magner pdf .pdf");
  let pdfAttachment: { filename: string; path: string; contentType: string } | null = null;
  let pdfSizeBytes: number | null = null;
  try {
    const stats = await fs.stat(pdfPath);
    pdfSizeBytes = stats.size;

    // Many providers (incl. Gmail) reject large attachments. Keep a safe limit.
    const maxAttachmentBytes = 20 * 1024 * 1024; // 20MB
    if (stats.size <= maxAttachmentBytes) {
      pdfAttachment = {
        filename: "SeniorsStuck-Guide.pdf",
        path: pdfPath,
        contentType: "application/pdf",
      };
    } else {
      pdfAttachment = null;
    }
  } catch {
    // If the file is missing, still send the email with a link (avoids silent failure).
    pdfAttachment = null;
  }

  console.log('[sendPDF] sending email', {
    to: email,
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    hasAttachment: Boolean(pdfAttachment),
    pdfSizeBytes,
  });

  const downloadUrl = options.downloadUrl;
  const fallbackLine = downloadUrl
    ? `Download your PDF here: ${downloadUrl}`
    : "If you did not receive the PDF attachment, reply to this email and we will resend it.";

  const info = await transporter.sendMail({
    from: emailUser,
    to: email,
    subject: "Your Seniors Stuck PDF Guide",
    text: [
      "Thank you for subscribing to Seniors Stuck.",
      "",
      pdfAttachment ? "Your PDF guide is attached to this email." : fallbackLine,
      "",
      "Mark Johnson, PhD",
      "SeniorsStuck.com",
    ].join("\n"),
    html: `
      <h2>Thank you for subscribing to Seniors Stuck</h2>
      <p>${pdfAttachment ? "Your PDF guide is attached to this email." : (downloadUrl ? `Your PDF is too large to attach. <a href="${downloadUrl}">Click here to download it</a>.` : "We could not attach the PDF automatically. Please reply to this email and we will resend it.")}</p>
      <p style="margin-top:16px;">Mark Johnson, PhD<br/>SeniorsStuck.com</p>
    `,
    ...(pdfAttachment ? { attachments: [pdfAttachment] } : {}),
  });

  console.log("[sendPDF] email sent", {
    to: email,
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  });
}
