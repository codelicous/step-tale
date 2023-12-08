import { StaticImageData } from "next/image";

type Entity = {
  id: string;
};

type Name = {
  name: string;
};

export type User = Entity &
  Name & {
    avatar?: string;
    games: Partial<Game>[];
  };
export type DisplayUser = User & {
  avatarImage: StaticImageData;
};
export type GameStatus = "waiting" | "active" | "finished";

export type GameUsers = Entity & {
  gameId: string;
  userIdList: string[];
};

export type Game = {
  id: string;
  name: string;
  status: GameStatus;
};

export type Entry = Entity & {
  gameId: string;
  userId: string;
  content: string;
  timestamp: number;
};
export type DisplayEntry = Entry & {
  user: DisplayUser;
};
