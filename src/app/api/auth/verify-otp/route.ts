import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Access stored reset data
    const storedData = global.passwordResets?.[email];
    if (!storedData) {
      return NextResponse.json({ error: "No OTP request found" }, { status: 400 });
    }

    if (storedData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // If OTP matches → return the reset token
    return NextResponse.json({
      success: true,
      message: "OTP verified",
      resetToken: storedData.resetToken,
    });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
