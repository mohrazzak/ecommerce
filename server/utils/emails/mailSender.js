require(`dotenv`).config();
const nodemailer = require('nodemailer');

exports.sendMail = async (email, token, subject, message) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EM_HOST,
    port: process.env.EM_PORT,
    secure: true,
    auth: {
      user: process.env.EM_USER,
      pass: process.env.EM_PASSWORD,
    },
  });
  // FIXME EDIT THE NAME AND TITLE BELOW
  await transporter.sendMail({
    from: `"myName" <${process.env.EM_USER}>`,
    to: email,
    subject: subject,
    html: `
    <h1>Title</h1>
    ${message}
    <p>Greeting.</p>
    `,
  });
};
