export const PLAYER_CLASSES_LIST = ["Mage", "Warrior", "Archer", "Assassin", "Healer"] as const;
export type PLAYER_CLASSES_TYPE = (typeof PLAYER_CLASSES_LIST)[number]; 