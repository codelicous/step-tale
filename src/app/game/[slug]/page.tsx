import { getGame } from "@/firebase/firebase-util";
import { DocumentReference, getDoc, getDocs } from "firebase/firestore";

export default async function CurrentGamePage(props: {
  params: { slug: string };
}) {
  const gameData = await getGame(props.params.slug);
  if (!gameData) return <p>no game</p>;
  const { name, entries, users } = gameData;

  return (
    <div>
      <h1>
        Current Game id: {props.params.slug} and name is: {name}
      </h1>
      <h2>Entries</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>{entry.content}</li>
        ))}
      </ul>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
