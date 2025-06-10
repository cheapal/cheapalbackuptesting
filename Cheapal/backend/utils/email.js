import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendApprovalEmail = async (email, listingTitle) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your listing has been approved',
      html: `
        <p>Hello,</p>
        <p>Your subscription listing "${listingTitle}" has been approved and is now visible to buyers.</p>
        <p>Thank you for using our platform!</p>
      `
    });
  } catch (error) {
    console.error('Error sending approval email:', error);
  }
};

export const sendRejectionEmail = async (email, listingTitle, reason) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your listing has been rejected',
      html: `
        <p>Hello,</p>
        <p>Your subscription listing "${listingTitle}" has been rejected.</p>
        <p>Reason: ${reason}</p>
        <p>Please review and resubmit with the necessary changes.</p>
      `
    });
  } catch (error) {
    console.error('Error sending rejection email:', error);
  }
};