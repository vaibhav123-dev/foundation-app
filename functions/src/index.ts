import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ""), // Remove spaces
    },
  });
};

// Cloud Function triggered when a new member is added
export const onMemberCreated = onDocumentCreated(
  "members/{memberId}",
  async (event) => {
    const snap = event.data;
    if (!snap) {
      console.log("No data associated with the event");
      return;
    }
    
    const memberData = snap.data();
    const memberId = event.params.memberId;

    try {
      // Generate certificate (you'll need to implement this logic)
      // For now, we'll just send a welcome email

      const transporter = createTransporter();

      const mailOptions = {
        from: `"${process.env.FOUNDATION_NAME}" <${process.env.FOUNDATION_EMAIL}>`,
        to: memberData.email,
        subject: `Welcome to ${process.env.FOUNDATION_NAME}!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #D97706; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; background-color: #f9f9f9; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .button { 
                display: inline-block; 
                padding: 10px 20px; 
                background-color: #D97706; 
                color: white; 
                text-decoration: none; 
                border-radius: 5px; 
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to ${process.env.FOUNDATION_NAME}!</h1>
              </div>
              <div class="content">
                <h2>Dear ${memberData.name},</h2>
                <p>Thank you for joining ${process.env.FOUNDATION_NAME}! We are delighted to have you as a member of our community.</p>
                
                <p><strong>Your Membership Details:</strong></p>
                <ul>
                  <li><strong>Name:</strong> ${memberData.name}</li>
                  <li><strong>Email:</strong> ${memberData.email}</li>
                  <li><strong>Contact:</strong> ${memberData.contact}</li>
                  <li><strong>Member ID:</strong> ${memberId}</li>
                </ul>
                
                <p>Your membership certificate has been generated and is attached to this email. You can also download it anytime from your member dashboard.</p>
                
                <p>We look forward to working with you in our mission to create positive change in our community.</p>
                
                <p>If you have any questions, please don't hesitate to contact us.</p>
                
                <p>Best regards,<br>
                <strong>${process.env.FOUNDATION_NAME}</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} ${process.env.FOUNDATION_NAME}. All rights reserved.</p>
                <p>Inspired by the ideals of Shaheed Bhagat Singh, we work towards creating a society based on equality, justice, and human welfare.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      await transporter.sendMail(mailOptions);

      console.log(`Welcome email sent to ${memberData.email}`);

      // Update member document with email sent status
      await snap.ref.update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {success: true};
    } catch (error) {
      console.error("Error sending welcome email:", error);
      
      // Update member document with error status
      await snap.ref.update({
        emailSent: false,
        emailError: error instanceof Error ? error.message : "Unknown error",
      });

      // Don't throw error - we don't want to fail the member creation
      return {success: false, error};
    }
  });

// HTTP function to send certificate email (can be called manually)
export const sendCertificateEmail = onCall(async (request) => {
  // Verify authentication
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const {memberEmail, memberName, certificateUrl} = request.data;

  if (!memberEmail || !memberName || !certificateUrl) {
    throw new HttpsError(
      "invalid-argument",
      "Missing required fields"
    );
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.FOUNDATION_NAME}" <${process.env.FOUNDATION_EMAIL}>`,
      to: memberEmail,
      subject: `Your Membership Certificate - ${process.env.FOUNDATION_NAME}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #D97706; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { 
              display: inline-block; 
              padding: 10px 20px; 
              background-color: #D97706; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px; 
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${process.env.FOUNDATION_NAME}</h1>
            </div>
            <div class="content">
              <h2>Dear ${memberName},</h2>
              <p>Your membership certificate is ready!</p>
              
              <p>Click the button below to download your certificate:</p>
              
              <a href="${certificateUrl}" class="button">Download Certificate</a>
              
              <p>Thank you for being a valued member of our foundation.</p>
              
              <p>Best regards,<br>
              <strong>${process.env.FOUNDATION_NAME}</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${process.env.FOUNDATION_NAME}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {success: true, message: "Certificate email sent successfully"};
  } catch (error) {
    console.error("Error sending certificate email:", error);
    throw new HttpsError(
      "internal",
      "Failed to send email"
    );
  }
});
