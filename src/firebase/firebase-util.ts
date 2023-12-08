import { User } from "@/types";
import { initializeApp } from "@firebase/app";
import {
  collection,
  getDocs as _getDocs,
  getFirestore,
} from "@firebase/firestore";
import { doc } from "firebase/firestore";
// import { Entry, Game, GameUsers, User } from "@/types";
// import { query } from "firebase/database";
// import { where } from "firebase/firestore";

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

const dbRef = () => collection(db, "story-weaver");
const usersRef = () => collection(db, "users");
const getDocs = () => _getDocs(dbRef());
const getGamesDocs = () => _getDocs(collection(db, "games"));
const getUsersDocs = () => _getDocs(usersRef());

const userQuery = (userId: string) => collection(db, "users");

// const getDocId = async () => (await getDocs()).docs[0]?.id;

export async function getUsers(): Promise<User[]> {
  "use server";
  let data: Record<string, User> = {};
  const docs = await getUsersDocs();

  docs.forEach((i) => {
    const d = i.data();
    console.log(d);
    data = { ...data, ...d };
  });
  console.log(data);
  return Object.values(data);
}

export async function getUser(userId: string): Promise<User | undefined> {
  console.log("get user", userId);

  ("use server");
  const docs = (await getUsers()) as unknown as User[];
  console.log("user docs", docs);
  return docs.find((u) => u.id === userId);
}

// export async function addEntry(entry: Entry): Promise<void> {
//   // Get a reference to the story-weaver document.
//   // const storyWeaverRef = doc(db, "story-weaver", await getDocId());

//   // // Create an update object with the array field value that you want to update.
//   // const update = {
//   //   entries: arrayUnion(entry),
//   // };

//   // // Update the document.
//   // await updateDoc(storyWeaverRef, update);
// }
// export async function addEntryAndRefreshData(entry: Entry): Promise<Entry[]> {
//   // await addEntry(entry);
//   // return await getEntries();
// }
