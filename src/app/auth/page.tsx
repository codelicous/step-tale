import { getUsers } from "@/firebase/firebase-util";
import { User } from "@/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

let CurrentUserId: User["id"] | null;

export default async function Auth() {
  return (
    <main className="flex flex-col justify-center">
      <h1 className="text-6xl bold text-center">Step Tale</h1>
      <div className="flex justify-center">
        <ChooseUser />
      </div>
    </main>
  );
}

async function ChooseUser() {
  const users = await getUsers();
  async function choose(FormData: FormData) {
    "use server";
    const val = FormData.get("user");
    console.log(val);
    if (typeof val === "string") {
      CurrentUserId = val;
      cookies().set("user", val);
      redirect("/game");
    }
  }
  if ((users || []).length === 0) return <p>No users</p>;
  return (
    <form className="flex flex-col gap-2 mt-10" action={choose}>
      <select name="user" id="user" required>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        className="p-2 bg-blue-400 hover:bg-blue-600 hover:text-gray-200 rounded"
        type="submit"
      >
        Choose
      </button>
    </form>
  );
}
