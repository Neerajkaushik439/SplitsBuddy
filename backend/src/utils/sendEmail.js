const path = require("path");
const { Resend } = require("resend");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

let resendClient = null;
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) resendClient = new Resend(key);
  return resendClient;
}

const sendEmail = async ({ to, subject, html, text }) => {
  const resend = getResend();
  if (!resend) {
    console.warn("📧 Email skipped: set RESEND_API_KEY in backend/.env");
    return { skipped: true };
  }
  console.log("📧 Sending email to:", to);
  console.log("Subject:", process.env.EMAIL_FROM);
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  });
  console.log("✅ Email sent:", result);
  return result;
};

module.exports = sendEmail;

