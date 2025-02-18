const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
const cors = require('cors');
const PORT = process.env.PORT || 3000;
// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));
//during deploy we have remove that one because it renders the file when open on browser
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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,  // Ensure this is an App Password
    },
});
// Email Sending Function
async function sendEmail(email , name) {
    try {
        let info = await transporter.sendMail({
            from: '" Code Crafters Programming Club" <dev.ccpc@gmail.com>',
            to: email,
            subject: "Next Steps for Your Code Crafters Programming Club Registration",
            text: `Dear ${name},\n` +
                "\n" +
                "Thank you for registering for the Code Crafters Programming Club! We’re thrilled to have you take the next step in joining our community of passionate coders.\n" +
                "\n" +
                "To evaluate your skills and approach, we have assigned a task for you. Please find the task details in the document linked below:\n" +
                "\n" +
               ` "📌 Task Document:https://docs.google.com/document/d/1jUdkuXKYLQf1zCbwS0CzkaRxxbeb2RqNBUeKYI4Fvn8/edit?usp=sharing\n"` +
                "\n" +
                "Submission Guidelines:\n" +
                "✅ Complete the given task within the specified timeline.\n" +
                "✅ Upload your solution file and provide the GitHub repository link in the response form.\n" +
                "\n" +
                `📌 Response Form:https://forms.gle/UbESfaUvxLCADXEj6\n` +
                "\n" +
                "Shortlisted candidates will be invited for an interview based on their submissions. This is not just a test but an opportunity to showcase your problem-solving abilities and coding style.\n" +
                "\n" +
                "If you have any questions, feel free to reach out. We’re excited to see your work!\n" +
                "\n" +
                "Best Regards,\n" +
                "Code Crafters Programming Club",
            // html: "<b>Welcome to our platform!</b>",
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
        const emailSent = await sendEmail(email,name);
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

