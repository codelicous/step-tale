"use client";

import { Card } from "@/components/ui/card";
import { Suspense, useEffect, useState } from "react";
import { GameComponent } from "../game";
import { ContentForm } from "./form";
import { DocumentReference, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase-util";
import { Game, User } from "@/types";

export function GameData({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}) {
  const [gameData, setGameData] = useState<Game>();
  useEffect(() => {
    const docRef = doc(db, "games", gameId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const gameData = snapshot.data() as Game;
      setGameData(gameData);
      return () => {
        unsubscribe();
      };
    });
  }, [gameId]);

  const currentPlayer = gameData?.users[gameData.activePlayerIndex];

  return (
    <>
      <Card>
        {gameData && currentPlayer && (
          <GameComponent
            currentPlayer={currentPlayer}
            userId={userId}
            entries={gameData?.entries || []}
            users={
              (gameData?.users || []) as unknown as DocumentReference<User>[]
            }
          />
        )}
      </Card>
      {gameData && (
        <ContentForm
          gameData={{ ...gameData, id: gameId }}
          gameDocRef={gameId}
          userId={userId}
        />
      )}
    </>
  );
}
