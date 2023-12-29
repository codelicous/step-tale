import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = cookies().get("user");

  console.log(user);
  if (!user) {
    redirect("/auth");
  } else {
    redirect("/game");
  }
}
