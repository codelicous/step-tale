import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getGame } from "@/firebase/firebase-util";
import { DocumentReference, getDoc, getDocs } from "firebase/firestore";
import { GameComponent } from "./game";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";

export default async function CurrentGamePage(props: {
  params: { slug: string };
}) {
  const user = cookies().get("user");
  const gameData = await getGame(props.params.slug);
  if (!gameData) return <p>no game</p>;
  const { name, entries, users } = gameData;

  return (
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
              <Textarea />
            </Card>
          </div>
          <div className="w-1/12 flex align-bottom items-end justify-end">
            <Button>Add</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
