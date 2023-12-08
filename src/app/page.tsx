import Avatar1Image from "@/assets/images/avatars/avatar-1.png";
import Avatar2Image from "@/assets/images/avatars/avatar-2.png";
import Avatar3Image from "@/assets/images/avatars/avatar-3.png";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const user = cookies().get("user");

export default async function Home() {
  if (!user) {
    redirect("/auth");
  } else {
    redirect("/game");
  }
}
