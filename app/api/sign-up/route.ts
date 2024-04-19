import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request, res: Response) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    const existingUserVerifiedByUserName = await UserModel.findOne({
      username: username,
      isVerified: true,
    });
    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email: email,
    });

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;

        existingUserByEmail.verifyCode = verificationCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expityData = new Date();
      expityData.setHours(expityData.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verificationCode,
        verifyCodeExpiry: expityData,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    // send verificationEmail
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering a user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering a user",
      },
      { status: 500 }
    );
  }
}
