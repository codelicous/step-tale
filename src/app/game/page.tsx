import { Form } from "@/components/game-form";
import { getUserGames } from "@/firebase/firebase-util";
import { cookies } from "next/headers";

const user = cookies().get("user") as unknown as string;
//TODO: add game list
export default async function ChooseGamePage() {
  const games = await getUserGames(user);

  return (
    <div>
      {games.length === 0 && <p>No games</p>}
      {games.length > 0 && (
        <Form>
          <select placeholder="choose game" name="game" id="game" required>
            {games.map((game) => (
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
        </Form>
      )}
    </div>
  );
}
