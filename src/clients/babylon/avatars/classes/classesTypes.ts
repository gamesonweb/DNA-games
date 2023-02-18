export const PLAYER_CLASSES_LIST = ["Mage", "Warrior", "Archer", "Assassin", "Healer"] as const;
export type PLAYER_CLASSES_TYPE = (typeof PLAYER_CLASSES_LIST)[number];

export const MONSTER_CLASSES_LIST = ["Pumpkin", "Warrior", "Archer", "Assassin", "Healer"] as const;
export type MONSTER_CLASSES_TYPE = (typeof MONSTER_CLASSES_LIST)[number];

export const OTHER_CLASSES_LIST = ["Campfire", "Grass", "Tree"] as const;
export type OTHER_CLASSES_TYPE = (typeof OTHER_CLASSES_LIST)[number];

export type AVATAR_CLASSES = MONSTER_CLASSES_TYPE | PLAYER_CLASSES_TYPE
export type ALL_CLASSES = AVATAR_CLASSES | OTHER_CLASSES_TYPE