const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'your-email@gmail.com',
        clientId: 'Your-Google-Client-ID',
        clientSecret: 'Your-Google-Client-Secret',
        refreshToken: 'Your-Refresh-Token',
        accessToken: 'Your-Access-Token', // Optional, wird automatisch aus dem Refresh Token generiert
    }
});

transporter.sendMail({
    from: 'your-email@gmail.com',
    to: 'recipient@example.com',
    subject: 'Hello from Nodemailer!',
    text: 'Hello from Nodemailer using Gmail and OAuth2!',
}, (err, info) => {
    if (err) {
        console.error('Error sending email:', err);
    } else {
        console.log('Email sent:', info.response);
    }
});


module.exports = { sendEmail };
