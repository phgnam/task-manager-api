// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'task-manager@local',
        subject: 'Thanks for join in.',
        text: `Welcome to app, ${name}. Let me know how you get along with the app.`
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'task-manager@local',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back soon.`
    });
}

module.exports = { sendWelcomeEmail, sendCancelationEmail };