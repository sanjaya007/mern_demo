const nodemailer = require("nodemailer");

let otp = "";
const generateOTP = () => {
  for (let i = 0; i <= 3; i++) {
    const randVal = Math.round(Math.random() * 9);
    otp = otp + randVal;
  }
  return otp;
};

const mailTransport = () =>
  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USERNAME,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });

const emailTemplate = (OTP) => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <div>
          <h1>${OTP}</h1>
        </div>
      </body>
    </html>
    `;
};

module.exports = { generateOTP, mailTransport, emailTemplate };
