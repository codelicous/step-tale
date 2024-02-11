import { Entry, Game, User } from "@/types";
import { initializeApp } from "@firebase/app";
import {
  getDocs as _getDocs,
  collection,
  doc,
  getFirestore,
} from "@firebase/firestore";
import {
  DocumentReference,
  arrayUnion,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const usersColRef = () => collection(db, "users");
export const gamesColRef = () => collection(db, "games");
const getGameDocs = () => _getDocs(gamesColRef());
const getUsersDocs = () => _getDocs(usersColRef());
export async function getGames(): Promise<Game[]> {
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
  const _d = doc(db, "games", gameId);
  const game = (await getDoc(_d)).data() as Game & {
    users: DocumentReference<User>[];
  };

  return (
    game && {
      ...game,
      users: (await Promise.all(
        game.users
          //@ts-expect-error
          .map(async (u) => await getDoc(u))
          .map(async (u) => {
            const data = (await u).data() as Partial<User>;
            return { ...data, id: (await u).id } as User;
          })
      )) as User[],
    }
  );
}

export async function getGameEntries(gameId: string): Promise<Game[]> {
  const docs = (await getGames()) as unknown as Game[];
  return docs.filter((g) => g.id === gameId);
}

export async function getUsers(): Promise<User[]> {
  const userData = await getUsersDocs();
  return userData.docs
    .map((doc) => {
      const d = doc.data();

      return { ...d, id: doc.id } as User;
    })
    .reverse();
}

export async function getUser(userId: string): Promise<User | undefined> {
  const docs = (await getUsers()) as unknown as User[];
  console.log("user docs", docs);
  return docs.find((u) => u.id === userId);
}

export async function insertEntry(entry: Entry, gameData: Game) {
  try {
    const gameDoc = doc(db, "games", gameData.id);
    await updateDoc(gameDoc, { entries: arrayUnion(entry) });
    const nextPlayerIndex =
      (gameData.activePlayerIndex + 1) % gameData.users.length;
    await updateDoc(gameDoc, {
      activePlayerIndex:
        (gameData.activePlayerIndex + 1) % gameData.users.length,
    });
  } catch (err) {
    console.log(err);
  }
}
