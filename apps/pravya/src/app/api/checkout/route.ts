import { authOptions } from "@repo/auth";
import { prisma } from "@repo/db";
import DodoPayments from "dodopayments";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const dodopayments = new DodoPayments({
  environment: "test_mode",
  bearerToken: process.env.DODOPAYMENTS_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    // Generate checkout URL
    const session = await getServerSession(authOptions as any);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        message: "User not found to subscribe",
      });
    }

    const checkout = await dodopayments.checkoutSessions.create({
      product_cart: [
        {
          product_id: "pdt_dhvBFL5nBkpdXeDomgMGa",
          quantity: 1,
        },
      ],
      customer: {
        name: user.name,
        email: user.email!,
      },
      billing_currency: "INR",

      allowed_payment_method_types: [
        "credit",
        "debit",
        "upi_collect",
        "upi_intent",
      ],

      return_url: "http://localhost:3000/",
    });

    return NextResponse.json({
      message: "Checkout URL created successfully",
      url: checkout.checkout_url,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
