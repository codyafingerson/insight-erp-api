import nodemailer from 'nodemailer';
import * as expressHandlebars from 'express-handlebars';
import path from 'path';
import { logger } from './logger';
import { environment } from '../config/environment';

// Create the transporter
const transporter = nodemailer.createTransport({
    service: 'Zoho',
    host: environment.mail.host,
    port: environment.mail.port,
    secure: true,
    auth: {
        user: environment.mail.user,
        pass: environment.mail.password
    }
});

// Create an instance of express-handlebars with the full configuration
const hbsEngine = expressHandlebars.create({
    extname: ".hbs",
    layoutsDir: path.resolve(__dirname, "../emails"),
    defaultLayout: false,
});

// Configure handlebars options using the engine instance
const handlebarOptions = {
    viewEngine: hbsEngine, // now it's a full ExpressHandlebars instance
    viewPath: path.resolve(__dirname, "../emails"),
    extName: ".hbs",
};

// A flag to ensure we attach the plugin only once
let isMailerInitialized = false;

const initializeMailerTemplateEngine = async () => {
    if (!isMailerInitialized) {
        const { default: hbs } = await import('nodemailer-express-handlebars');
        transporter.use("compile", hbs(handlebarOptions));
        isMailerInitialized = true;
    }
};

export const sendMailWithTemplate = async (
    to: string,
    subject: string,
    templateName: string,
    context: any
) => {
    // Ensure our template engine is attached before sending the email
    await initializeMailerTemplateEngine();

    const mailOptions = {
        from: environment.mail.user,
        to,
        subject,
        template: templateName, // name of the template file without extension
        context // context variables for the template
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email sent to ${to} with subject ${subject}`);
    } catch (error) {
        console.log(mailOptions);
        logger.error(`Error sending email to ${to} with template ${templateName}`);
        logger.error(error);
    }
};