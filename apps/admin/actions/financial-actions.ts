"use server";

import { prisma } from "@repo/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function getPayments() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return { success: false, error: "Unauthorized" };
    }

    const payments = await prisma.payment.findMany({
      select: {
        paymentId: true,
        user: {
          select: {
            email: true,
          },
        },
        amount: true,
        currency: true,
        dodoPaymentId: true,
        createdAt: true,
        metadata: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPayments = payments.map((payment) => ({
      id: payment.paymentId,
      user: payment.user.email || "N/A",
      amount: payment.currency === "INR" ? payment.amount / 100 : payment.amount,
      currency: payment.currency,
      orderId: payment.dodoPaymentId,
      date: payment.createdAt ? new Date(payment.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) : "N/A",
      metadata: payment.metadata,
    }));

    return { success: true, payments: formattedPayments };
  } catch (error) {
    console.error("Get payments error:", error);
    return { success: false, error: "Failed to fetch payments" };
  }
}

