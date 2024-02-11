import { Card } from "@/components/ui/card";
import { getGame } from "@/firebase/firebase-util";
import { cookies } from "next/headers";
import { ContentForm } from "./components/form";
import { GameData } from "./components/game-data";
import { GameComponent } from "./game";
import { Suspense } from "react";

export default async function CurrentGamePage(props: {
  params: { slug: string };
}) {
  const user = cookies().get("user");
  const gameDocRef = props.params.slug;
  const gameData = await getGame(gameDocRef);
  if (!gameData) return <p>no game</p>;
  const { name, entries, users, activePlayerIndex } = gameData;
  const isActive = users[activePlayerIndex].id === user?.value;

  return (
    <main className="p-10">
      <h1 className="text-6xl text-blue-600 font-black text-center">{name}</h1>
      <section className="flex flex-col gap-4 mt-10">
        <GameData gameId={props.params.slug} userId={user?.value || ""} />
      </section>
    </main>
  );
}
