import Avatar1Image from "@/assets/images/avatars/avatar-1.png";
import Avatar2Image from "@/assets/images/avatars/avatar-2.png";
import Avatar3Image from "@/assets/images/avatars/avatar-3.png";
import { Avatar } from "@/components/avatar";
import { Form } from "@/components/game-form";
import { Line } from "@/components/line";
import {DisplayEntry, Entry, Game as GameComp, User} from "@/types";
import { revalidatePath } from "next/cache";
import {addEntryAndRefreshData, getEntries, getUsers} from "@/firebase/firebase-util";
import {StaticImageData} from "next/image";
import entry from "next/dist/server/typescript/rules/entry";

export interface MockUser {
  avatar: string;
  name: string;
}
function mockDataIterator({user, text}: {user: MockUser, text: string} ) {
   return (
      <Line key={text}>
        <div className="flex gap-1 items-center">
          <div className="pr-3 border-r border-gray-100">
            <Avatar src={user.avatar} />
          </div>
          {text}
        </div>
      </Line>
  );
}

const keyBy = <T extends Record<string, any>, K extends keyof T>(
  arr: T[],
  key: K
) =>
  arr.reduce(
    (acc, item) => {
      acc[item[key]] = item;
      return acc;
    },
    {} as Record<string, T>
  );

const game: GameComp = {
  id: "1",
  name: "first game",
  status: "active",
};

const images: Record<string, StaticImageData> = {
  avatar1: Avatar1Image,
  avatar2: Avatar2Image,
  avatar3: Avatar3Image,
};

const users: User[] = await getUsers() as any;

const getGameData = async (): Promise<{entries: DisplayEntry[], game: GameComp}> => {
  const usersRecord = keyBy(await getUsers(), "id");
  const entries =(await getEntries()).map((entry) => ({
    ...entry,
    user: {
      ...usersRecord[entry.userId],
    avatarImage: images[usersRecord[entry.userId].avatar ]},

  }));

  return {
    entries,
    game
}


};
async function getUsersRecord(): Promise<Record<string, User>> {
    return keyBy(await getUsers(), "id");
}
export async function getDisplayEntries() {
    const usersRecord = await getUsersRecord();
    const entries = await  getEntries();

    return composeEntries(entries, usersRecord);
}

export function composeEntries(entries: Entry[], usersRecord: Record<string, User>) {
    return entries.map(entry => ({
        ...entry,
        user: {
            ...usersRecord[entry.userId],
            avatarImage: images[usersRecord[entry.userId].avatar ]},

    }));
}

let CurrentUserId: User["id"] | null;

const getUser = async () => {
  const user = CurrentUserId ? users.find((u) => u.id === CurrentUserId) : null;
  return Promise.resolve(user);
};

export default async function Home() {
  const user = await getUser();
  return (
    <main className="flex flex-col justify-center">
      <h1 className="text-6xl bold text-center">Step Tale</h1>
      <div className="flex justify-center">
        {!user && <ChooseUser />}
        {user && <GameComp user={user} />}
      </div>
    </main>
  );
}

async function ChooseUser() {
  const users = await getUsers();
  async function choose(FormData: FormData) {
    "use server";
    const val = FormData.get("user");
    if (typeof val === "string") {
      CurrentUserId = val;
    }
    revalidatePath("/");
  }
  return (
    <form className="flex flex-col gap-2 mt-10" action={choose}>
      <select placeholder="choose user" name="user" id="user" required>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button
        className="p-2 bg-blue-400 hover:bg-blue-600 hover:text-gray-200 rounded"
        type="submit"
      >
        Choose
      </button>
    </form>
  );
}

async function GameComp({ user }: { user: User }) {
  let { game, entries } = await getGameData();
  async function add(formData: FormData) {
    "use server";

    const content = formData.get("content");
    const entry: Entry = {
      id: crypto.randomUUID(),
      userId: user.id,
      gameId: game.id,
      content: content as string,
      timestamp: Date.now(),
    };
      const rawEntries = await addEntryAndRefreshData(entry)
      const usersRecord = await getUsersRecord();

      entries = composeEntries(rawEntries,usersRecord);
    revalidatePath("/");
  }
  return (
    <div className="w-1/3 pt-10 flex flex-col gap-1">
      {entries.map(({ user, content, id }, i) => {
        return (
          <Line key={id}>
            <div className="flex gap-1 items-center">
              <div className="pr-3 border-r border-gray-100">
                <Avatar src={user.avatarImage} />
              </div>
              {content}
            </div>
          </Line>
        );
      })}
      <Form action={add} />
    </div>
  );
}
