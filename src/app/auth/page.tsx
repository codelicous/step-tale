import { getUsers } from "@/firebase/firebase-util";
import { User } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

let CurrentUserId: User["id"] | null;

const getUser = async () => {
  const user = CurrentUserId
    ? (await getUsers()).find((u) => u.id === CurrentUserId)
    : null;
  return Promise.resolve(user);
};

export default async function Auth() {
  const user = await getUser();
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
    if (typeof val === "string") {
      CurrentUserId = val;
    }
    redirect("/game");
  }
  return (
    <form className="flex flex-col gap-2 mt-10" action={choose}>
      <select placeholder="choose user" name="user" id="user" required>
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
