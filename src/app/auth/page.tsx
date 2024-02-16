import { Input } from "@/components/ui/input";
import { auth, getUsers } from "@/firebase/firebase-util";
import { User } from "@/types";
import {
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  sendSignInLinkToEmail,
  signInWithEmailLink,
} from "firebase/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { error } from "console";

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: "http://localhost:3000/game",
  // This must be true.
  handleCodeInApp: true,
};

export default async function Auth(params: {
  searchParams: {
    apiKey: "";
    mode: "signIn";
    oobCode: string;
    continueUrl: string;
    lang: "en";
  };
  params: { slug: string };
}) {
  if (params.searchParams.mode === "signIn") {
    try {
      const h = headers();
      const email = cookies().get("email");
      const url = h.get("referer")!;
      console.log(url);

      const auth = getAuth();
      console.log("sign in:", email, email?.value, url);
      const u = await signInWithEmailLink(auth, email?.value!, url).catch(
        (e) => {
          console.log("error", e);
        }
      );
      console.log(u);
      if (u) {
        redirect("/game");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const submitMail = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      console.log("email sent");
      cookies().set("email", email);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main className="flex flex-col justify-center">
      <h1 className="text-6xl bold text-center">Step Tale</h1>
      <div className="flex justify-center">
        <form action={submitMail}>
          <label htmlFor="name">email</label>
          <Input name="email" type="email" />
          <button
            className="p-2 bg-blue-400 hover:bg-blue-600 hover:text-gray-200 rounded"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
