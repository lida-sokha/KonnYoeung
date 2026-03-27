const nodemailer = require("nodemailer");

// Use an object as the argument to make it flexible for both OTP and Reset Links
const sendEmail = async ({ email, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"KonnYoeung App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text, 
      html: html, 
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", email);
  } catch (error) {
    console.error("Email send failed:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;