const nodemailer = require("nodemailer");
const { generateOneTimeCode } = require("./otpFunctionManager");
require("dotenv").config();
// const { generateOneTimeCode } = require("../models/one");

// /*
const transporter = nodemailer.createTransport({
  // service: 'hotmail',
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
// */

async function sendEmail(email, options) {
  const { type, message } = options;
  let verificationCode;
  let mailOptions = {};

  if (type === "INITIAL_VERIFICATION") {
    verificationCode = await generateOneTimeCode(email);
    mailOptions = {
      from: `Presence Eye <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Presence Eye Verification Code",
      text: `Hello,\n\nThank you for signing up with Presence Eye! To complete your registration, please verify your email address using the code below:\n\nVerification Code: ${verificationCode}\n\nAlternatively, you can click the following link to verify your email:\nhttps://buu-backend.onrender.com/verify/email?email=${email}&code=${verificationCode}\n\nIf you did not sign up for this account, please ignore this email.\n\nBest regards,\nBYOSE Team`,
      html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #4CAF50; text-align: center;">Welcome to Presence Eye!</h1>
                <p>Hello,</p>
                <p>Thank you for signing up with <strong>Presence Eye</strong>! To complete your registration, please verify your email address using the code below:</p>
                <p style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center;">${verificationCode}</p>
                <p>Alternatively, you can click the following link to verify your email:</p>
                <p style="text-align: center;">
                    <a href="${process.env.SERVER_URL}/v1/verify/email?email=${email}&code=${verificationCode}" 
                       style="background-color: #4CAF50; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">
                       Verify My Email
                    </a>
                </p>
                <p>If you did not sign up for this account, please ignore this email.</p>
                <p>Best regards,<br>BYOSE Team</p>
            </div>
        `,
    };
  } else if (type === "VERIFICATION_CODE") {
    verificationCode = await generateOneTimeCode(email);
    mailOptions = {
      from: `Presence Eye <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Re-verify Your Email Address",
      text: `Hello,\n\nWe noticed that you need to re-verify your email address for your Presence Eye account. Please use the code below to complete the process:\n\nVerification Code: ${verificationCode}\n\nIf you did not request this, please contact our support team immediately.\n\nBest regards,\nPresence Eye Team`,
      html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h1 style="color: #4CAF50; text-align: center;">Re-verify Your Email Address</h1>
                <p>Hello,</p>
                <p>We noticed that you need to re-verify your email address for your <strong>Presence Eye</strong> account. Please use the code below to complete the process:</p>
                <p style="font-size: 30px; font-weight: bold; color: #4CAF50; text-align: center;">${verificationCode}</p>
                <p>If you did not request this, please contact our support team immediately.</p>
                <p>Best regards,<br>BYOSE Team</p>
            </div>
        `,
    };
  } else if (type === "ALERT_PASSWORD") {
    mailOptions = {
      from: `Presence Eye <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Your Password Has Been Changed",
      text: "We wanted to let you know that the password for your account on Presence Eye has been successfully changed.",
      html: `
                   <div>
                        <h1 style="color: #4CAF50;">Password Changed Successfully</h1>
                       <p>Hello,</p>
                       <p>This is a confirmation that the password for your account on <strong>Presence Eye</strong> has been successfully changed.</p>
                       <p>If you did not make this change, please contact our support team immediately to secure your account.</p>
                       <p>Best regards,<br>Presence Eye Team</p>
                   </div>
               `,
    };
  } else if (type === "ALERT_MESSAGE") {
    mailOptions = {
      from: `Presence Eye <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "ALERT MESSAGE FROM Presence Eye",
      text: message,
      html: `<div style="font-family: Arial, sans-serif; color: #333;">${message}</div>`,
    };
  } else if (type === "LOGIN_OTP") {
    verificationCode = await generateOneTimeCode(email);
    mailOptions = {
      from: `Presence Eye <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Presence Eye Login Verification Code",
      text: `Hello,\n\nWe received a request to log into your Presence Eye account. Use the verification code below to complete the process:\n\nVerification Code: ${verificationCode}\n\nIf you did not request this, please ignore this message or contact our support team immediately.\n\nBest regards,\nThe Presence Eye Team`,
      html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h1 style="color: #4CAF50; text-align: center;">Login Verification Code</h1>
                        <p>Hello,</p>
                        <p>We received a request to log into your <strong>Presence Eye</strong> account. Please use the code below to complete the process:</p>
                        <p style="font-size: 30px; font-weight: bold; color: #4CAF50; text-align: center;">${verificationCode}</p>
                        <p>If you did not request this, please ignore this message or contact our support team immediately.</p>
                        <p>Best regards,<br><strong>Presence Eye Team</strong></p>
                    </div>
                `,
    };
  } else if (type === "LOGIN_PASSKEY_OTP") {
    verificationCode = await generateOneTimeCode(email);
    mailOptions = {
      from: `Presence Eye <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: "Presence Eye Login Verification Code",
      text: `Hello,\n\nWe received a request to log into your Presence Eye account with PassKey. Use the verification code below to complete the process:\n\nVerification Code: ${verificationCode}\n\nIf you did not request this, please ignore this message or contact our support team immediately.\n\nBest regards,\nThe Presence Eye Team`,
      html: `
                    <div style="font-family: Arial, sans-serif; color: #333;">
                        <h1 style="color: #4CAF50; text-align: center;">Login Verification Code</h1>
                        <p>Hello,</p>
                        <p>We received a request to log into your <strong>Presence Eye</strong> account with PassKey. Please use the code below to complete the process:</p>
                        <p style="font-size: 30px; font-weight: bold; color: #4CAF50; text-align: center;">${verificationCode}</p>
                        <p>If you did not request this, please ignore this message or contact our support team immediately.</p>
                        <p>Best regards,<br><strong>Presence Eye Team</strong></p>
                    </div>
                `,
    };
  } else {
    return;
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

// sendVerificationEmail("hopehirwa50@gmail.com","User")
module.exports = { sendEmail };
