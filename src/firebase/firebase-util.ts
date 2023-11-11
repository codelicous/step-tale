import { initializeApp } from "@firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  QuerySnapshot,
  updateDoc,
  doc,
  arrayUnion,
} from "@firebase/firestore";
import { Entry, User } from "@/types";

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
const db = getFirestore(app);

const dbRef = () => collection(db, "story-weaver");

export async function getData(): Promise<any> {
  let snapshot: QuerySnapshot;
  try {
    snapshot = await getDocs(dbRef());
    return snapshot.docs.map((doc) => doc.data())[0] as any;
  } catch (e) {
    throw e;
  }
}

const docId = ((await getDocs(dbRef())) as any).docs[0]?.id;
export async function getUsers(): Promise<User[]> {
  "use server";

  return ((await getData()) as Record<string, any>).users as User[];
}

export async function getEntries(): Promise<Entry[]> {
  try {
    return ((await getData()) as Record<string, any>).entries as Entry[];
  } catch (e) {
    throw e;
  }
}

export async function addEntry(entry: Entry): Promise<void> {
  // Get a reference to the story-weaver document.
  const storyWeaverRef = doc(db, "story-weaver", docId);

  // Create an update object with the array field value that you want to update.
  const update = {
    entries: arrayUnion(entry),
  };

  // Update the document.
  await updateDoc(storyWeaverRef, update);
}
export async function addEntryAndRefreshData(entry: Entry): Promise<Entry[]> {
  await addEntry(entry);
  return await getEntries();
}
