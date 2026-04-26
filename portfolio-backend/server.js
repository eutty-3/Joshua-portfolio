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

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

/* ---------------- CONTACT ROUTE ---------------- */
app.post('/api/contact', async (req, res) => {
  const { first_name, last_name, email, subject, message } = req.body;

  if (!first_name || !last_name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required'
    });
  }

  try {
    const result = await resend.emails.send({
      from: 'Joshua Portfolio <onboarding@resend.dev>',
      to: 'ondarigwaro@gmail.com',
      subject: `📩 ${subject} - from ${first_name} ${last_name}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${first_name} ${last_name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `
    });

    console.log('Email sent:', result);

    return res.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

/* ---------------- START ---------------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});