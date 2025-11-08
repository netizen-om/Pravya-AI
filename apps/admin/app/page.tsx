import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";

export default async function Home() {
  const admin = await getCurrentAdmin();
  
  if (admin) {
    redirect("/admin");
  } else {
    redirect("/sign-in");
  }
}
