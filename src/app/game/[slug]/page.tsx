import { getGame } from "@/firebase/firebase-util";

export default async function CurrentGamePage(props: {
  params: { slug: string };
}) {
  console.log(props);
  const gameData = await getGame(props.params.slug);
  console.log(gameData);

  return (
    <div>
      <h1>Current Game id: {props.params.slug}</h1>
    </div>
  );
}
