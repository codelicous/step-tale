import { Game, User } from "@/types";
import { initializeApp } from "@firebase/app";
import {
  collection,
  getDocs as _getDocs,
  getFirestore,
} from "@firebase/firestore";
import { DocumentReference, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const mainCollectionMap = ["games", "story-weaver", "users"].reduce(
  (acc, k, i) => {
    acc[k] = i;
    return acc;
  },
  {} as Record<string, number>
);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// const dbRef = () => collection(db, "story-weaver");
// const userGamesRef = (userRef) => collection(userRef, "games");
const usersColRef = () => collection(db, "users");
export const gamesColRef = () => collection(db, "games");
const getGameDocs = () => _getDocs(gamesColRef());
// const usersRef = (userId: string) => doc(db, `users/${userId}`);
// const getDocs = () => _getDocs(dbRef());
// const getGamesDocs = () => _getDocs(collection(db, "games"));
const getUsersDocs = () => _getDocs(usersColRef());

const userQuery = (userId: string) => collection(db, "users");

export async function getGames(): Promise<Game[]> {
  "use server";
  console.log("getGames");
  const gameData = await getGameDocs();
  return gameData.docs
    .map((doc) => {
      const d = doc.data();
      return { ...d, id: doc.id } as Game;
    })
    .reverse();
}

export async function getGame(gameId: string): Promise<Game | undefined> {
  console.log("gameId", gameId);
  const docs = (await getGames()) as unknown as Array<
    Game & { users: DocumentReference<User>[] }
  >;
  console.log("game docs", docs);
  const game = docs.find((g) => g.id === gameId);

  return (
    game && {
      ...game,
      users: (await Promise.all(
        game.users
          //@ts-expect-error
          .map(async (u) => await getDoc(u))
          .map(async (u) => (await u).data())
      )) as User[],
    }
  );
}

export async function getGameEntries(gameId: string): Promise<Game[]> {
  "use server";
  const docs = (await getGames()) as unknown as Game[];
  return docs.filter((g) => g.id === gameId);
}

export async function getUsers(): Promise<User[]> {
  "use server";

  const userData = await getUsersDocs();
  return userData.docs
    .map((doc) => {
      const d = doc.data();
      console.log("user id", doc.id);
      console.log("user games", doc.ref);
      console.log("user data", d);
      return { ...d, id: doc.id } as User;
    })
    .reverse();
}

export async function getUser(userId: string): Promise<User | undefined> {
  "use server";
  const docs = (await getUsers()) as unknown as User[];
  console.log("user docs", docs);
  return docs.find((u) => u.id === userId);
}
