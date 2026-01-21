const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Lowercase "gmail" is standard
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST be the 16-character App Password
      },
    });

    const mailOptions = {
      from: `"KonnYoeung App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;