import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: {
          select: {
            provider: true,
          },
        },
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const provider = user.accounts.length > 0 ? user.accounts[0].provider : null;
    
    // build a simplified response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      imagePublicId: user.imagePublicId,
      bio: user.bio,
      isSubscribed: user.isSubscribed,
      isDeleted: user.isDeleted,
      provider, // flattened field
    };
    
    return NextResponse.json({ userResponse }, { status: 200 });
  } catch (error) {
    console.log("Erroe getting user data : ", error);
    return NextResponse.json(
      { error: "Error getting user details" },
      { status: 500 }
    );
  }
}
