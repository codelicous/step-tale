type Entity = {
  id: string;
};

type EntityWithName = Entity & {
  name: string;
};

export type GameUsers = Entity & {
  gameId: string;
  userIdList: string[];
};

export type User = EntityWithName & {
  //email: string;
};

export type Game = EntityWithName & {
  rulesId: string; // Can be list of rules?
};

export type GameRules = Entity & {
  sentencePerGame: number;
};
