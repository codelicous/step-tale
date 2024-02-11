"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/firebase-util";
import { Entry, Game } from "@/types";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";

async function insertEntry(entry: Entry, gameData: Game) {
  try {
    const gameDoc = doc(db, "games", gameData.id);
    await updateDoc(gameDoc, { entries: arrayUnion(entry) });
    const nextPlayerIndex =
      (gameData.activePlayerIndex + 1) % gameData.users.length;
    await updateDoc(gameDoc, {
      activePlayerIndex: nextPlayerIndex,
    });
  } catch (err) {
    console.log(err);
  }
}

export function ContentForm({
  gameData,
  gameDocRef,
  userId,
}: {
  gameData: Game;
  gameDocRef: string;
  userId: string;
}) {
  const [content, setContent] = useState("");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await insertEntry(
          {
            id: crypto.randomUUID(),
            userId,
            gameId: gameDocRef,
            content,
            createdAt: Date.now(),
          },
          gameData
        );
        setContent("");
      }}
    >
      <Card>
        <div className="w-full flex p-2 bg-slate-300">
          <Input
            onChange={(e) => {
              setContent(e.target.value);
            }}
            value={content}
            name="textContent"
            required
          />
          <div className="w-1/12 flex align-bottom items-end justify-end">
            <Button disabled={!content} type="submit">
              Add
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
