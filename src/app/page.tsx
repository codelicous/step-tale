import { Avatar } from "@/components/avatar";
import { Line } from "@/components/line";
import Avatar1Image from "@/assets/images/avatars/avatar-1.png";

import { Form } from "@/components/game-form";
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

export  default async function Home() {
  const data = await getMockData()
  const list = data[0].list

  async function add(formData: FormData) {

    "use server";
    for (const entry of formData.values()) {
      console.log(entry)
    }

    const val = formData.get("text");
    if (typeof val === "string") {
      list.push({
        user: {
          name: "first user",
          avatar: Avatar1Image,
        },
        text: val,
      });
    }
    revalidatePath("/");
  }
  return (
    <main className="flex flex-col justify-center">
      <h1 className="text-6xl bold text-center">Step Tale</h1>
      <div className="flex justify-center">
        <div className="w-1/3 pt-10 flex flex-col gap-1">
          {list.map(mockDataIterator)}
          <Form action={add} />
        </div>
      </div>
    </main>
  );
}
