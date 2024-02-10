"use client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  getEntriesSnapshot,
  getGame,
  getGameEntries,
} from "@/firebase/firebase-util";
import { Entry, Game, User } from "@/types";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export function GameComponent({
  entries,
  users,
  userId,
}: {
  userId: User["id"];
  entries: Entry[];
  users: User[];
}) {
  const [gameEntires, setGameEntries] = useState(entries);

  useEffect(() => {
    const unsubscribe = getEntriesSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setGameEntries(data[0].entries as Entry[]);
    });
    return () => unsubscribe();
  }, [entries]);
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <div className="flex flex-col gap-4 p-2 bg-gray-900 text-gray-100">
          <h2 className="text-2xl">Users</h2>
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <li
                className={
                  userId === user.id ? "text-red-300" : "text-gray-100"
                }
                key={user.id}
              >
                {user.name}
              </li>
            ))}
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        {" "}
        <div className="flex flex-col gap-4 p-2">
          <h2 className="text-2xl">Entries</h2>
          <div className="flex flex-col gap-2">
            {gameEntires.map((entry) => (
              <li key={entry.id}>{entry.content}</li>
            ))}
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
