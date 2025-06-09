import { Injectable } from "@nestjs/common";
import nodemailer from "nodemailer";
import { readFile } from "fs/promises"; // ES6 import for file system access
import { ConfigService } from "@nestjs/config";
import path from "path";
import { hash } from "src/common/utils/utils";

@Injectable()
export class EmailService {
  constructor(private readonly config: ConfigService) {}

  async sendEmailVerification(recipient, customerUserCode, otp) {
    try {
      const evEmail = this.config.get<string>("EV_EMAIL");
      const evPass = this.config.get<string>("EV_PASS");
      const evAddress = this.config.get<string>("EV_ADDRESS");
      const evSubject = this.config.get<string>("EV_SUBJECT");
      const evTempPath = this.config.get<string>("EV_TEMPLATE_PATH");
      const evCompany = this.config.get<string>("EV_COMPANY");
      const evVerifyURL = this.config.get<string>("EV_URL");
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use 'gmail' for Google's SMTP
        auth: {
          user: evEmail, // Replace with your Gmail address
          pass: evPass.toString().trim(), // Replace with your Gmail App Password
        },
      });
      let emailTemplate = await readFile(
        path.join(__dirname, evTempPath),
        "utf-8"
      );
      emailTemplate = emailTemplate.replace("{{_OTP_}}", otp);
      const hastOTP = await hash(otp);
      emailTemplate = emailTemplate.replace(
        "{{_URL_}}",
        `${evVerifyURL}?user=${customerUserCode}&code=${hastOTP}`
      );
      emailTemplate = emailTemplate.replace(
        "{{_YEAR_}}",
        new Date().getFullYear().toString()
      );
      emailTemplate = emailTemplate.replace("{{_COMPANY_}}", evCompany);
      const info = await transporter.sendMail({
        from: evAddress, // Sender address
        to: recipient, // List of recipients
        subject: evSubject, // Subject line
        html: emailTemplate, // HTML body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return true;
    } catch (ex) {
      throw ex;
    }
  }

  async sendResetPasswordOtp(recipient, userCode, otp) {
    try {
      const evEmail = this.config.get<string>("EV_EMAIL");
      const evPass = this.config.get<string>("EV_PASS");
      const evAddress = this.config.get<string>("EV_ADDRESS");
      const evSubject = this.config.get<string>("EV_RESET_SUBJECT");
      const evTempPath = this.config.get<string>("EV_RESET_TEMPLATE_PATH");
      const evCompany = this.config.get<string>("EV_COMPANY");
      const evVerifyURL = this.config.get<string>("EV_URL");
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use 'gmail' for Google's SMTP
        auth: {
          user: evEmail, // Replace with your Gmail address
          pass: evPass.toString().trim(), // Replace with your Gmail App Password
        },
      });
      let emailTemplate = await readFile(
        path.join(__dirname, evTempPath),
        "utf-8"
      );
      emailTemplate = emailTemplate.replace("{{_OTP_}}", otp);
      const hastOTP = await hash(otp);
      emailTemplate = emailTemplate.replace(
        "{{_URL_}}",
        `${evVerifyURL}?user=${userCode}&code=${hastOTP}`
      );
      emailTemplate = emailTemplate.replace(
        "{{_YEAR_}}",
        new Date().getFullYear().toString()
      );
      emailTemplate = emailTemplate.replace("{{_COMPANY_}}", evCompany);
      const info = await transporter.sendMail({
        from: evAddress, // Sender address
        to: recipient, // List of recipients
        subject: evSubject, // Subject line
        html: emailTemplate, // HTML body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return true;
    } catch (ex) {
      throw ex;
    }
  }

  async sendEmailFromContact(dto: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    try {
      const evEmail = this.config.get<string>("EV_EMAIL"); //shajflowershoponline@gmail.com
      const evPass = this.config.get<string>("EV_PASS"); //key
      const evTempPath = "../assets/email-form-confirmation.html";
      const evCompany = this.config.get<string>("EV_COMPANY");
      const transporter = nodemailer.createTransport({
        service: "gmail", // Use 'gmail' for Google's SMTP
        auth: {
          user: evEmail, // Replace with your Gmail address
          pass: evPass.toString().trim(), // Replace with your Gmail App Password
        },
      });
      let emailTemplate = await readFile(
        path.join(__dirname, evTempPath),
        "utf-8"
      );
      emailTemplate = emailTemplate.replace("{{_NAME_}}", dto.name);
      emailTemplate = emailTemplate.replace("{{_EMAIL_}}", dto.email);
      emailTemplate = emailTemplate.replace("{{_SUBJECT_}}", dto.subject);
      emailTemplate = emailTemplate.replace("{{_MESSAGE_}}", dto.message);
      emailTemplate = emailTemplate.replace(
        "{{_YEAR_}}",
        new Date().getFullYear().toString()
      );
      emailTemplate = emailTemplate.replace("{{_COMPANY_}}", evCompany);
      const info = await transporter.sendMail({
        from: `"${evCompany}" <${evEmail}>`, // Sender address
        to: `${dto.email} ${evEmail}`, // List of recipients
        subject: `We've received your message – ${evCompany} Support Team | ${dto.subject}`, // Subject line
        html: emailTemplate, // HTML body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      return true;
    } catch (ex) {
      throw ex;
    }
  }
}
