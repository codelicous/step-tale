"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Entry, User } from "@/types";
import { DocumentReference, onSnapshot, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export function GameComponent({
  currentPlayer,
  entries,
  users,
  userId,
}: {
  currentPlayer: User;
  userId: User["id"];
  entries: Entry[];
  users: DocumentReference<User>[];
}) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <div className="flex flex-col gap-4 p-2 bg-gray-900 text-gray-100">
          <h2 className="text-2xl">Users</h2>
          <div className="flex flex-col gap-2">
            <GameUsers
              currentPlayer={currentPlayer}
              userId={userId}
              usersRefs={users}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="flex flex-col gap-4 p-2 max-h-80 overflow-auto">
          <h2 className="text-2xl">Entries</h2>
          <div className="flex flex-col gap-2">
            <p>
              {entries
                .map((e) => e.content)
                .join(". ")
                .replace("..", ".")}
            </p>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function GameUsers({
  usersRefs,
  userId,
  currentPlayer,
}: {
  currentPlayer: User;
  userId: string;
  usersRefs: DocumentReference<User>[];
}) {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const setUsersFromFirebase = async () => {
      const data = (await Promise.all(
        usersRefs
          .map(async (u) => await getDoc(u))
          .map(async (u) => {
            const data = (await u).data() as Partial<User>;
            return { ...data, id: (await u).id } as User;
          })
      )) as User[];
      setUsers(data);
    };
    setUsersFromFirebase();
  }, [usersRefs]);

  return (
    <>
      {users.map((user) => (
        <li
          className={userId === user.id ? "text-red-300" : "text-gray-100"}
          key={user.id}
        >
          {user.name} {currentPlayer.id === user.id && "(current)"}
        </li>
      ))}
    </>
  );
}
