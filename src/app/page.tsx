import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/firebase/firebase-util";

export default async function Home() {
  console.log(auth.currentUser);
  if (!auth.currentUser) {
    redirect("/auth");
  } else {
    redirect("/game");
  }
}
