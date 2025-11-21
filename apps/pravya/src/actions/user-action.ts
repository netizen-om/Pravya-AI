"use server"
import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUserDetails() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id : userId },
      include : { subscription : true }
    });

    if (!user) return null;

    const isSubscribed =
    user.subscription?.status === "ACTIVE" &&
    (!user.subscription.endDate || user.subscription.endDate > new Date());
    

    return {...user, isSubscribed}

  } catch (error) {
    console.error("Error fetching user Details:", error);
    throw error;
  }
}
