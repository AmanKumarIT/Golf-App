import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Find current user and update to active
      const session = await getServerSession(authOptions) as any;
      if (session?.user?.id) {
        await supabase
          .from('users')
          .update({
            subscriptionStatus: "active",
            entries: 10, // Give them 10 startup entries
          })
          .eq('id', session.user.id);
      }

      return NextResponse.json({ success: true, message: "Payment Verified" }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Validation failed" }, { status: 500 });
  }
}
