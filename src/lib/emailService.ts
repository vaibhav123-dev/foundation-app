import emailjs from '@emailjs/browser';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface WelcomeEmailData {
  memberName: string;
  memberEmail: string;
  certificateBlob: Blob;
}

// EmailJS configuration
// Get these from https://www.emailjs.com/
// 1. Create account
// 2. Add email service (Gmail, Outlook, etc.)
// 3. Create email template
// 4. Get your credentials from Account > API Keys
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS
export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

export const sendWelcomeEmail = async (data: WelcomeEmailData): Promise<void> => {
  try {
    // Convert blob to base64 for email attachment
    const certificateBase64 = await blobToBase64(data.certificateBlob);
    
    // Prepare email parameters
    const templateParams = {
      to_email: data.memberEmail,
      to_name: data.memberName,
      from_name: 'Veer Bhagat Singh Foundation',
      message: `Dear ${data.memberName},\n\nWelcome to the Veer Bhagat Singh Foundation family!\n\nWe are delighted to have you join our mission to serve the community and uphold the values and ideals of Shaheed Bhagat Singh. Your membership certificate is attached to this email.\n\nAs a member, you are now part of a dedicated group working towards social welfare, education, and community empowerment. We look forward to your active participation in our initiatives.\n\nThank you for your commitment to making a positive difference.\n\nWith warm regards,\nVeer Bhagat Singh Foundation`,
      reply_to: 'vabdarwekar00@gmail.com',
    };

    // Send email using EmailJS
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Generate HTML email template
const generateWelcomeEmailHTML = (memberName: string, joinedDate: string): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Veer Bhagat Singh Foundation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                    Welcome to Veer Bhagat Singh Foundation
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">
                    Dear ${memberName},
                  </h2>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">
                    Welcome to the <strong>Veer Bhagat Singh Foundation</strong> family! We are absolutely delighted to have you join our mission.
                  </p>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">
                    As a member, you are now part of a dedicated community working towards social welfare, education, and community empowerment. Together, we uphold the values and ideals of Shaheed Bhagat Singh.
                  </p>
                  
                  <div style="background-color: #FFF3E0; border-left: 4px solid #FF6B35; padding: 15px; margin: 20px 0; border-radius: 4px;">
                    <p style="color: #333333; margin: 0; font-size: 14px;">
                      <strong>Membership Date:</strong> ${new Date(joinedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 20px 0 15px 0; font-size: 16px;">
                    Your membership certificate has been downloaded to your device. We will send you a physical certificate along with your membership card in the coming days.
                  </p>
                  
                  <h3 style="color: #333333; margin: 25px 0 15px 0; font-size: 20px;">
                    What's Next?
                  </h3>
                  
                  <ul style="color: #666666; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                    <li>Stay connected with our upcoming events and initiatives</li>
                    <li>Participate in community service programs</li>
                    <li>Join our social media channels for updates</li>
                    <li>Attend our monthly member meetings</li>
                  </ul>
                  
                  <p style="color: #666666; line-height: 1.6; margin: 20px 0 0 0; font-size: 16px;">
                    Thank you for your commitment to making a positive difference in our community.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f8f8; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
                  <p style="color: #999999; margin: 0 0 10px 0; font-size: 14px;">
                    With warm regards,<br>
                    <strong style="color: #FF6B35;">Veer Bhagat Singh Foundation</strong>
                  </p>
                  <p style="color: #999999; margin: 10px 0 0 0; font-size: 12px;">
                    123, Freedom Lane, Sector 17, Chandigarh - 160017, Punjab, India
                  </p>
                  <p style="color: #999999; margin: 5px 0 0 0; font-size: 12px;">
                    Email: vabdarwekar00@gmail.com | Phone: +91 98765 43210
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Send contact form email to foundation
export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<void> => {
  try {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.warn('⚠️ EmailJS not configured. Skipping email send.');
      return;
    }

    console.log('📧 Sending contact form email...');

    const FOUNDATION_EMAIL = import.meta.env.VITE_FOUNDATION_EMAIL || 'vabdarwekar00@gmail.com';

    // Prepare email parameters for contact form
    const templateParams = {
      to_email: FOUNDATION_EMAIL,
      to_name: 'Veer Bhagat Singh Foundation',
      from_name: name,
      from_email: email,
      sender_name: name,
      sender_email: email,
      reply_to: email,
      subject: `Contact Form: ${subject}`,
      user_subject: subject,
      user_message: message,
      message: `
New contact form submission from your website:

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
You can reply directly to this email to respond to ${name}.
      `.trim(),
    };

    // Use contact template if available, otherwise fall back to regular template
    const templateId = EMAILJS_CONTACT_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
    
    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      templateId,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Contact form email sent successfully!', response);
    console.log('Template used:', templateId);
  } catch (error) {
    console.error('❌ Error sending contact email:', error);
    throw error;
  }
};

// Send welcome email with certificate download link
export const sendWelcomeEmailSimple = async (
  memberName: string,
  memberEmail: string,
  certificateBlob: Blob,
  memberId: string,
  joinedDate?: string
): Promise<void> => {
  try {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.warn('⚠️ EmailJS not configured. Skipping email send.');
      console.log('To enable emails, set up EmailJS credentials in .env file');
      return;
    }

    console.log('📧 Uploading certificate to Firebase Storage...');
    
    // Upload certificate to Firebase Storage
    const fileName = `${memberName.replace(/\s+/g, '_')}_${memberId}_certificate.pdf`;
    const certificateRef = ref(storage, `certificates/${fileName}`);
    await uploadBytes(certificateRef, certificateBlob);
    
    // Get download URL
    const certificateURL = await getDownloadURL(certificateRef);
    console.log('✅ Certificate uploaded to Firebase Storage:', certificateURL);

    console.log('📧 Sending welcome email to:', memberEmail);
    
    // Prepare email parameters with certificate download link
    const templateParams = {
      to_email: memberEmail,
      to_name: memberName,
      from_name: 'Veer Bhagat Singh Foundation',
      member_name: memberName,
      certificate_link: certificateURL,
      joined_date: joinedDate ? new Date(joinedDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      reply_to: 'vabdarwekar00@gmail.com',
    };

    // Send email using EmailJS with download link
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('✅ Welcome email with certificate link sent successfully!', response);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    
    // Don't throw - we don't want email failure to break the registration
    // Just log it and continue
    console.log('Registration completed despite email error');
  }
};
