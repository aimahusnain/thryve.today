import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, email, message, phone, country } =
      await req.json();

    if (!firstname || !lastname || !email || !message || !country) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // You can change the email design using html and css.
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Message From ${firstname} ${lastname} - Thryve.today`,
      html: `
<div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 48px 40px; position: relative;">
    <div style="color: white; font-size: 13px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.9; margin-bottom: 12px;">New Contact Request</div>
    <div style="color: white; font-size: 24px; font-weight: 600;">Thryve.today Medical Training</div>
  </div>

  <!-- Content -->
  <div style="padding: 48px 40px;">
    <!-- Contact Details -->
    <div style="margin-bottom: 40px; background: #fafafa; border-radius: 16px; padding: 32px;">
      <div style="margin-bottom: 24px;">
        <div style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Name</div>
        <div style="color: #1e293b; font-size: 16px; font-weight: 500;">${firstname} ${lastname}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Email</div>
        <div style="color: #1e293b; font-size: 16px;">${email}</div>
      </div>

      <div style="margin-bottom: 24px;">
        <div style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Phone</div>
        <div style="color: #1e293b; font-size: 16px;">${phone}</div>
      </div>

      <div>
        <div style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Country</div>
        <div style="color: #1e293b; font-size: 16px;">${country}</div>
      </div>
    </div>

    <!-- Message -->
    <div style="background: #fafafa; border-radius: 16px; padding: 32px;">
      <div style="color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">Message</div>
      <div style="color: #1e293b; font-size: 16px; line-height: 1.6;">${message}</div>
    </div>
  </div>

  <!-- Footer -->
  <div style="padding: 24px; text-align: center; color: #94a3b8; font-size: 14px; border-top: 1px solid #f1f5f9;">
    Message received from Thryve.today contact form
  </div>
</div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("Unexpected error:", e);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong! Please try again",
      },
      { status: 500 }
    );
  }
}
