const nodemailer = require("nodemailer");

// ✅ Setup nodemailer with cPanel SMTP (mail.gigpesa.co.ke)
const transporter = nodemailer.createTransport({
  host: "mail.gigpesa.co.ke",
  port: 465,
  secure: true,
  auth: {
    user: "support@gigpesa.co.ke",
    pass: "p3CGzT03+p(~cN{e",
  },
});

// ✅ Send Password Reset Email
async function sendResetEmail(to, name = "there", token) {
  const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: '"GigPesa Support" <support@gigpesa.co.ke>',
    to,
    subject: "Reset Your GigPesa Password",
    html: `
      <div style="font-family: 'Montserrat', sans-serif; background-color: #ffffff; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; max-width: 600px; margin: auto;">
          <tr>
            <td style="padding: 24px; text-align: left;">
              <img 
                src="https://i.ibb.co/fVQRY4fw/gigpesa-email-logo.png" 
                alt="GigPesa Logo" 
                style="width: 160px; height: auto;" 
                oncontextmenu="return false"
              />
            </td>
          </tr>

          <tr>
            <td style="padding: 0 24px 32px;">
              <h2 style="font-size: 18px; color: #111827; font-weight: 600;">Hello ${name},</h2>
              
              <p style="font-size: 15px; color: #374151;">
                You recently requested to reset your password for your GigPesa account.
                Click the button below to proceed. This link will expire in <strong>30 minutes</strong> for your security.
              </p>

              <div style="text-align: center; margin: 36px 0;">
                <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 16px;">
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; color: #6b7280;">
                If you didn’t request a password reset, you can safely ignore this email.
              </p>

              <p style="font-size: 12px; color: #6b7280; margin-top: 24px;">
                This is an automatically generated message. <strong>Please do not reply</strong> to this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f3f4f6; padding: 24px; text-align: center;">
              <p style="font-size: 12px; color: #6b7280;">
                © ${new Date().getFullYear()} GigPesa. All rights reserved.<br>
                Need help? Contact us at 
                <a href="mailto:support@gigpesa.co.ke" style="color: #16a34a;">support@gigpesa.co.ke</a>
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send reset email:", error);
    throw new Error("Could not send reset email.");
  }
}

// ✅ Send Welcome Email
async function sendWelcomeEmail(to, name = "there") {
  const mailOptions = {
    from: '"Gigpesa" <support@gigpesa.co.ke>',
    to,
    subject: "🎉 Welcome to GigPesa!",
    html: `
      <div style="font-family: 'Montserrat', sans-serif; background-color: #ffffff; padding: 24px; max-width: 600px; margin: auto;">
        <img src="https://i.ibb.co/fVQRY4fw/gigpesa-email-logo.png" alt="GigPesa Logo" style="width: 160px; margin-bottom: 20px;" />

        <h2 style="color: #111827;">Hi ${name},</h2>
        <p style="font-size: 15px; color: #374151;">
          Welcome to <strong>GigPesa</strong>! 🎉<br />
          We’re excited to have you join our community of digital freelancers and earners.
        </p>

        <p style="font-size: 14px; color: #6b7280;">
          You can now sign in and start exploring our platform. If you have any questions or need help, our support team is here for you.
        </p>

        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">
          This is an automated email. Please do not reply.<br />
          Need help? Contact us at <a href="mailto:support@gigpesa.co.ke" style="color: #16a34a;">support@gigpesa.co.ke</a>
        </p>

        <p style="font-size: 12px; color: #6b7280; text-align: center; margin-top: 24px;">
          © ${new Date().getFullYear()} GigPesa. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${to}`);
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
  }
}

// ✅ Export both functions
module.exports = {
  sendResetEmail,
  sendWelcomeEmail,
};
