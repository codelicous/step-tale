import Avatar1Image from "@/assets/images/avatars/avatar-1.png";
import Avatar2Image from "@/assets/images/avatars/avatar-2.png";
import Avatar3Image from "@/assets/images/avatars/avatar-3.png";
import { Avatar } from "@/components/avatar";
import { Form } from "@/components/game-form";
import { Line } from "@/components/line";
import { Entry, Game as GameComp, User } from "@/types";
import { revalidatePath } from "next/cache";
import {getMockData} from "@/firebase/initFireBase";
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

const images = {
  avatar1: Avatar1Image,
  avatar2: Avatar2Image,
  avatar3: Avatar3Image,
};

const users: User[] = [
  {
    id: "1",
    name: "first user",
    avatar: "avatar1",
  },
  {
    id: "2",
    name: "second user",
    avatar: "avatar2",
  },
  {
    id: "3",
    name: "third user",
    avatar: "avatar3",
  },
];

const entries: Entry[] = [
  {
    id: "1",
    userId: "1",
    gameId: "1",
    content: "first entry",
    timestamp: 1697363827652,
  },
  {
    id: "2",
    userId: "2",
    gameId: "1",
    content: "second entry",
    timestamp: 1697363913686,
  },
  {
    id: "3",
    userId: "3",
    gameId: "1",
    content: "third entry",
    timestamp: 1697363924859,
  },
];

function addEntry(entry: Entry) {
  entries.push(entry);
  return Promise.resolve("");
}

const getUsers = async () => {
  return Promise.resolve(users);
};

const getEntries = async () => {
  return Promise.resolve(entries);
};

const getGameData = async () => {
  const usersRecord = keyBy(await getUsers(), "id");
  const entries = (await getEntries()).map((entry) => ({
    ...entry,
    user: usersRecord[entry.userId],
    avatar: images[usersRecord[entry.userId].avatar as keyof typeof images],
  }));

  return {
    game,
    entries,
  };
};

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
  const { game, entries } = await getGameData();
  async function add(formData: FormData) {
    "use server";
    // for (const entry of formData.values()) {
    //   console.log(entry)
    // }

    const content = formData.get("content");
    const entry: Entry = {
      id: crypto.randomUUID(),
      userId: user.id,
      gameId: game.id,
      content: content as string,
      timestamp: Date.now(),
    };

    await addEntry(entry);
    revalidatePath("/");
  }
  return (
    <div className="w-1/3 pt-10 flex flex-col gap-1">
      {entries.map(({ user, content, id }, i) => {
        return (
          <Line key={id}>
            <div className="flex gap-1 items-center">
              <div className="pr-3 border-r border-gray-100">
                <Avatar src={user.avatar} />
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
