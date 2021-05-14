import { createTransport } from "nodemailer"
type Token = string;

const transport = createTransport({
  port: 1025,
  ignoreTLS: true
})

export default {
  activationEmail(token: Token) {
    // Compose email
    const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by clicking the following link:
      <br/>
      On the following page:
      <a target="_blank" href="${
        process.env.APP_HOST
      }/auth/activate/${token}">${
      process.env.APP_HOST
    }/auth/activate/${token}</a>
      <br/><br/>
      Have a pleasant day.`;
    return html;
  },
  resetPassword(token: Token) {
    const html = `
    <h1>Please use the following link to reset your password</h1>
    <a target="_blank" href="${
      process.env.APP_HOST
    }/auth/password/reset/${token}">${
      process.env.APP_HOST
    }/auth/password/reset/${token}</a>
    `;
    return html;
  },
  sendEmail(from: string, to: string, subject: string, html: string) {
    return new Promise((resolve, reject) => {
      transport.sendMail({ from, subject, to, html }, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
  },
};