import { NextApiRequest, NextApiResponse } from "next";
import "@/firebase/firebase-util";
import admin from "firebase-admin";
import { Server } from "socket.io";

const db = admin.firestore();

export async function GameSync(req: NextApiRequest, res: NextApiResponse) {
  if (!req.socket.server?.io) {
    console.log("Initializing socket.io");
    const io = new Server(req.socket.server);
    res.socket.server.io = io;
    io.on("connection", (socket) => {
      console.log("socket.io connected");
      socket.on("join", (gameId: string) => {
        socket.join(gameId);
        console.log("socket.io joined room", gameId);
      });
    });
  }

  const gameId = req.query.id as string;
  const gameRef = db.collection("games").doc(gameId);
  const game = (await gameRef.get()).data();
  if (!game) {
    res.status(404).json({ message: "Game not found" });
    return;
  }
  const gameData = game as {
    entries: { id: string; value: string }[];
    users: { id: string; name: string }[];
  };
  io.to(gameId).emit("game", gameData);
  res.status(200).json(gameData);
}

export default GameSync;
