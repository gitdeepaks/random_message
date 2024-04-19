import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/verfificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
  emails: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: emails,
      subject: "ransom_message Verification Code",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (emailError) {
    console.error(emailError, "Error in verification sending email");
    return {
      success: false,
      message: "Error in sending email",
    };
  }
}
