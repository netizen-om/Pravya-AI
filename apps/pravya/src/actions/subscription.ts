"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dodopayments } from "@/lib/dodopayments";

/* ----------------------------------------------
   Helper: Get Authenticated User ID
---------------------------------------------- */
async function getUser() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  return user;
}

/* ----------------------------------------------
   1) GET USER SUBSCRIPTION
---------------------------------------------- */
export async function getUserSubscription() {
  const user = await getUser();
  if (!user) return null;

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    include: {
      lastPayment: true,
    },
  });

  if (!subscription) return { hasSubscription : false };

  const now = new Date();
  const isActive =
    subscription.status === "ACTIVE" &&
    new Date(subscription.endDate) > now;

  return {
    hasSubscription: true,
    subscription: {
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      nextBillingDate: subscription.endDate,
      dodoSubscriptionId: subscription.dodoSubscriptionId,
      lastPaymentId: subscription.lastPaymentId,
      lastPayment: subscription.lastPayment,
      isActive,
    },
  };
}

/* ----------------------------------------------
   2) CANCEL SUBSCRIPTION
---------------------------------------------- */
export async function cancelSubscription() {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "Unauthorized" };
    }

    // 1) Get subscription from DB
    const existing = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!existing || !existing.dodoSubscriptionId) {
      return { error: "No active subscription to cancel" };
    }

    const dodoSubscriptionId = existing.dodoSubscriptionId;

    // 2) Cancel subscription on Dodo Payment server
    const result = await dodopayments.subscriptions.update(
      dodoSubscriptionId,
      {
        status: "cancelled",
      }
    );

    if (!result || result.status !== "cancelled") {
      return {
        error: "Failed to cancel subscription at payment gateway",
      };
    }

    // 3) Update your local DB subscription state
    await prisma.subscription.update({
      where: { userId: user.id },
      data: {
        status: "CANCELLED",
        updatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return { error: "Internal server error" };
  }
}