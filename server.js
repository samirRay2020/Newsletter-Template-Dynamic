const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// Email config (use dotenv in production)
const EMAIL_USER = "service@hello-delta.com";
const EMAIL_PASS = "WebScrServ2025!";

app.use(bodyParser.json({ limit: "5mb" }));
app.use(express.static("public")); // Serve your HTML + JS

app.post("/send-newsletter", async (req, res) => {
  const { to, subject, html } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      html,
    });

    res.json({ message: "✅ Email sent successfully." });
  } catch (error) {
    console.error("❌ Email error:", error);
    res.status(500).json({ message: "❌ Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
