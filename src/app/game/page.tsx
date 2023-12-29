import { getUser } from "@/firebase/firebase-util";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

//TODO: add game list
export default async function ChooseGamePage() {
  const userData = cookies().get("user") as unknown as {
    name: string;
    value: string;
  };
  console.log(userData);
  if (!userData) return redirect("/auth");
  const user = await getUser(userData?.value);
  if (!user) return <p>no user</p>;

  const games = user.games;

  const choose = async (formData: FormData) => {
    "use server";
    const val = formData.get("game");
    return redirect(`/game/${val}`);
  };

  return (
    <div>
      {games && games.length === 0 && <p>No games</p>}
      {(games || []).length > 0 && (
        <>
          <h1>choose game</h1>
          <form action={choose}>
            <select name="game" id="game" required>
              {games!.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
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
        </>
      )}
    </div>
  );
}
