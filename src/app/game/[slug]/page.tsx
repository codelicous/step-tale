import {getGame, insertEntry} from "@/firebase/firebase-util";
import { GameComponent } from "./game";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from 'uuid';


export default async function CurrentGamePage(props: {
  params: { slug: string };
}) {

  const user = cookies().get("user");
  const gameDocRef = props.params.slug;
  const gameData = await getGame(gameDocRef);
  if (!gameData) return <p>no game</p>;
  const { name, entries, users } = gameData;

  async function addEntry(formData: FormData) {
    "use server"

    const content = formData.get('textContent') as string;
    const userId = user?.value as  string;
    const gameId = gameData?.id as string;

    return await insertEntry({ id: uuidv4(), userId, gameId, content, createdAt: Date.now() }, gameDocRef)
  }
  return (
      <form action={addEntry}>
    <main className="p-10">
      <h1 className="text-6xl text-blue-600 font-black text-center">{name}</h1>
      <section className="flex flex-col gap-4 mt-10">
        <Card>
          <GameComponent
            userId={user?.value || ""}
            entries={entries}
            users={users}
          />
        </Card>
        <div className="flex gap-4">
          <div className="flex-grow">
            <Card>
              <Textarea  name="textContent"/>
            </Card>
          </div>
          <div className="w-1/12 flex align-bottom items-end justify-end">
            <Button  type="submit">Add</Button>
          </div>
        </div>
      </section>
    </main>
      </form>
  );
}
