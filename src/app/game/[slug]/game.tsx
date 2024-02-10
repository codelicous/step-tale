"use client";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { db } from "@/firebase/firebase-util";
import { Entry, Game, User } from "@/types";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

function useGameEntries(gameId: string, initialEntires: Entry[]) {
  const [gameEntires, setGameEntries] = useState(initialEntires);

  useEffect(() => {
    const docRef = doc(db, "games", gameId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const gameData = snapshot.data() as Game;
      setGameEntries(gameData.entries);
      return () => {
        unsubscribe();
      };
    });
  }, [initialEntires, gameId]);

  return gameEntires;
}

export function GameComponent({
  gameId,
  entries,
  users,
  userId,
}: {
  gameId: string;
  userId: User["id"];
  entries: Entry[];
  users: User[];
}) {
  const gameEntires = useGameEntries(gameId, entries);
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
