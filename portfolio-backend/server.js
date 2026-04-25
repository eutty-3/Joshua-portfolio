require('dotenv').config();
const express = require('express');
const path = require('path');
const { Resend } = require('resend');

const app = express();

/* ---------------- CONFIG ---------------- */
const PORT = process.env.PORT || 3000;
const resend = new Resend(process.env.RESEND_API_KEY);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());

// Serve frontend (optional)
app.use(express.static(path.join(__dirname, 'frontend')));

// Basic CORS (safe for development + simple deployment)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

/* ---------------- CONTACT ROUTE ---------------- */
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in all fields.'
    });
  }

  try {
    const result = await resend.emails.send({
      from: 'EuttyVA <onboarding@resend.dev>',
      to: 'euttyvirtual@gmail.com',
      subject: `New Message from ${name}`,
      html: `
        <h2>📩 New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });

    console.log('✅ Email sent:', result);

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!'
    });

  } catch (error) {
    console.error('❌ Email error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to send message. Try again later.'
    });
  }
});

/* ---------------- START SERVER ---------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
