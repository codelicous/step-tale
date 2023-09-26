import { Avatar } from "@/components/avatar";
import { Line } from "@/components/line";
import Avatar1Image from "@/assets/images/avatars/avatar-1.png";
import Avatar2Image from "@/assets/images/avatars/avatar-2.png";
import Avatar3Image from "@/assets/images/avatars/avatar-3.png";
import { Form } from "@/components/game-form";
import { revalidatePath } from "next/cache";
import clientPromise from "@/lib/mongodb";

async function checkData() {
  const client = await clientPromise;
  const db = client.db('story-weaver');
  const data = await db.collection("story-weaver").findOne({});
  return (data as any).story;
}

checkData().then(data=>{
  console.log('**************************************');
  console.log(data);
  console.log(JSON.parse(JSON.stringify(data)));
  console.log('***************************************');
})

const list = [
  {
    user: {
      name: "first user",
      avatar: Avatar1Image,
    },
    text: "a",
  },
  {
    user: {
      name: "second user",
      avatar: Avatar2Image,
    },
    text: "b",
  },
  {
    user: {
      name: "third user",
      avatar: Avatar3Image,
    },
    text: "c",
  },
];

export default function Home() {
  async function add(formData: FormData) {
    "use server";
    for (const entry of formData.values()) {
      console.log(entry);
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
          {list.map(({ user, text }, i) => {
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
          })}
          <Form action={add} />
        </div>
      </div>
    </main>
  );
}
