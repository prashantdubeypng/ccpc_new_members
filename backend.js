const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const nodemailer = require("nodemailer");
const PORT = process.env.PORT || 3000;
// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.error(err + " not connected");
    });

// User Schema & Model
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    PreferedLanguage: { type: String, required: true },
    Skills: { type: String, required: true },
    reg_no: { type: String, required: true },
    Batch: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,  // Ensure this is an App Password
    },
});

// Email Sending Function
async function sendEmail(email) {
    try {
        let info = await transporter.sendMail({
            from: '"Prashant Dubey 👻" <prashant2107pd@gmail.com>',
            to: email,
            subject: "Welcome!",
            text: "Thank you for registering!",
            html: "<b>Welcome to our platform!</b>",
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Email Error:", error);
        return false;
    }
}

// POST Request (Fixing Data Storage & Email Sending)
app.post('/login', async (req, res) => {
    try {
        const { email, password, name, phone, PreferedLanguage, Skills, reg_no, Batch } = req.body;

        // Validate required fields
        if (!email || !password || !name || !phone || !PreferedLanguage || !Skills || !reg_no || !Batch) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const alreadyExistUser = await User.findOne({ email });
        if (alreadyExistUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({ name, email, password, phone, PreferedLanguage, Skills, reg_no, Batch });
        await newUser.save();

        // Send email
        const emailSent = await sendEmail(email);
        if (!emailSent) {
            return res.status(500).json({ message: 'User registered but email failed to send' });
        }

        return res.status(200).json({ message: 'Form submitted and email sent successfully' });
    } catch (err) {
        console.error('Server Error:', err);
        return res.status(500).json({ error: 'Something went wrong, please try again!' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log("Server is running on port 3000");
});
