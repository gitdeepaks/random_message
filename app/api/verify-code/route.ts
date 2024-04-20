import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const { username, code } = await req.json();

    const decodedUserName = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUserName,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired please signup again",
        },
        {
          status: 400,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        {
          status: 400,
        }
      );
    }
  } catch (error) {
    console.error(error, "Error in verify code route");
    return Response.json(
      {
        success: false,
        message: "Error in verify code route",
      },
      {
        status: 500,
      }
    );
  }
};
