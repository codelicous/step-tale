type Entity = {
  id: string;
};

type Name = {
  name: string;
};

export type User = Entity & Name;
export type GameStatus = "waiting" | "playing" | "finished";

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
