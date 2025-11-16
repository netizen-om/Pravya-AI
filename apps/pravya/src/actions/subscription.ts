"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

  if (!subscription) return null;

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
  const user = await getUser();
  if (!user) return { error: "Unauthorized" };

  const existing = await prisma.subscription.findFirst({
    where: { userId: user.id },
  });

  if (!existing) return { error: "No subscription found" };

  await prisma.subscription.update({
    where: { userId: user.id },
    data: { status: "CANCELLED" },
  });

  return { success: true };
}
