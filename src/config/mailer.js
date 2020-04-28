const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "967d9bc7124e12",
      pass: "a5fddfd133acb2"
    }
  });