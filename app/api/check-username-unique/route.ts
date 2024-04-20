import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export const GET = async (req: Request, res: Response) => {
  await dbConnect();
  //   localhost:3000/api/check-username-unique?username=abc

  try {
    const { searchParams } = new URL(req.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log(result);
    if (!result.success) {
      const userNameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameError?.length > 0
              ? userNameError.join(",")
              : "Invalid username query parameter",
        },
        {
          status: 400,
        }
      );
    }
    //
    const { username } = result.data;

    const existigVerifiedUser = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (existigVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in cheking username", error);
    return Response.json(
      {
        success: false,
        message: "Error in checking username",
      },
      {
        status: 500,
      }
    );
  }
};
