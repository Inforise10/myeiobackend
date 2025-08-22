const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory');
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('Uploaded file:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream',
    ];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedTypes.includes(file.mimetype) || !allowedExtensions.includes(ext)) {
      return cb(new Error(`Invalid file type. Only PDF, DOC, or DOCX files are allowed. Received MIME type: ${file.mimetype}, Extension: ${ext}`));
    }
    cb(null, true);
  },
  limits: { fileSize: 4 * 1024 * 1024 },
});

// Middleware
app.use(cors({ origin: 'https://myeio.in' }));
app.use(bodyParser.json());
app.use(express.static('uploads'));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

// Contact Form Endpoint
app.post('/api/send-email', async (req, res) => {
  const { name, email, subject, message, to_email } = req.body;

  if (!name || !email || !subject || !message || !to_email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const mailOptions = {
    from: `"${name}" <${process.env.GMAIL_USER}>`,
    to: to_email,
    subject,
    text: `Message from ${name} (${email}):\n\n${message}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Career Application Endpoint
app.post('/api/send-career-application', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err.message);
      return res.status(400).json({ error: 'File upload error', details: err.message });
    } else if (err) {
      console.error('File Validation Error:', err.message);
      return res.status(400).json({ error: 'Invalid file', details: err.message });
    }
    console.log('File uploaded successfully:', req.file);
    next();
  });
}, async (req, res) => {
  const { jobType, position, fullName, phone, email, qualification, degree, experience, about, to_email } = req.body;
  const resume = req.file;

  if (!jobType || !position || !fullName || !phone || !email || !qualification || !degree || !experience || !about || !to_email || !resume) {
    return res.status(400).json({ error: 'All fields and resume are required' });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!/^\+?\d{10,15}$/.test(phone.trim())) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const mailOptions = {
    from: `"${fullName}" <${process.env.GMAIL_USER}>`,
    to: to_email,
    subject: `Career Application: ${position} (${jobType})`,
    text: `New career application:\n\nJob Type: ${jobType}\nPosition: ${position}\nName: ${fullName}\nPhone: ${phone}\nEmail: ${email}\nQualification: ${qualification}\nDegree: ${degree}\nExperience: ${experience}\nAbout: ${about}`,
    html: `
      <h3>New Career Application</h3>
      <p><strong>Job Type:</strong> ${jobType}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Qualification:</strong> ${qualification}</p>
      <p><strong>Degree:</strong> ${degree}</p>
      <p><strong>Experience:</strong> ${experience}</p>
      <p><strong>About:</strong></p><p>${about}</p>
    `,
    attachments: [
      {
        filename: resume.originalname,
        path: resume.path,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Application sent successfully' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ error: 'Failed to send application', details: error.message });
  }
});

// Test Email Endpoint
app.get('/api/test-email', async (req, res) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'myeiokln@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email from the server.',
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test Email Error:', error);
    res.status(500).json({ error: 'Failed to send test email', details: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});