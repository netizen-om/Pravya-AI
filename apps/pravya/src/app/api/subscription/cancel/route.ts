import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@repo/auth";
import { prisma } from "@repo/db";
import { dodopayments } from "@/lib/dodopayments";

export async function POST() {
  try {
    // 1) Validate user session
    const session = await getServerSession(authOptions as any);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2) Fetch subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }

    if (!subscription.dodoSubscriptionId) {
      return NextResponse.json(
        { error: "Missing Dodo subscription ID" },
        { status: 400 }
      );
    }

    // 3) Cancel it on Dodo Payments
    const dodoResult = await dodopayments.subscriptions.update(
      subscription.dodoSubscriptionId,
      {
        status: "cancelled",
      }
    );

    if (!dodoResult || dodoResult.status !== "cancelled") {
      return NextResponse.json(
        { error: "Failed to cancel subscription at payment provider" },
        { status: 500 }
      );
    }

    // 4) Update local DB
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, message: "Subscription cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
