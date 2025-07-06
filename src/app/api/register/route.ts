import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { registerUser } from "@/utils/auth";

// Schema for validation
const registerSchema = z.object({
  firstName: z.string().min(2, { message: "نام باید حداقل 2 کاراکتر باشد" }),
  lastName: z
    .string()
    .min(2, { message: "نام خانوادگی باید حداقل 2 کاراکتر باشد" }),
  email: z.string().email({ message: "ایمیل نامعتبر است" }),
  password: z
    .string()
    .min(6, { message: "رمز عبور باید حداقل 6 کاراکتر باشد" }),
});

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          message: "اطلاعات وارد شده نامعتبر است",
          errors: result.error.errors,
        },
        { status: 400 }
      );
    }

    // Register the user
    const userData = result.data;
    const user = await registerUser(userData);

    return NextResponse.json(
      {
        message: "ثبت نام با موفقیت انجام شد",
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    // Check if it's our known error
    if (error.message === "کاربری با این ایمیل قبلا ثبت شده است") {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }

    // General error
    return NextResponse.json(
      {
        message: "خطا در ثبت نام. لطفا دوباره تلاش کنید.",
      },
      { status: 500 }
    );
  }
}
