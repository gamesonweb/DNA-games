import { shuffle } from "../../../others/tools"

// From https://en.wikipedia.org/wiki/List_of_legendary_creatures_by_type
const names: string[] = ['Adlet', 'Amarok', 'Anubis', 'Aralez', 'Asena', 'Axehandle', 'BlackMon', 'Gevaudan', 'Carbuncle', 'Cerberus', 'Chupacabra', 'Cu Sith', 'Crocotta', 'Cynocephaly', 'Dogs of Actaeon', 'Fenrir', 'Gelert', 'Hellhound', 'HuliJing', 'Huodou', 'Orthrus', 'Penghou', 'Salawa', 'Sigbin', 'Shug', 'Tanuki', 'Vǎrkolak', 'Werewolf', 'Bael', 'Ball-tailed', 'BlueTiger', 'Cactus', 'Cat-sith', 'Palug', 'Carbuncle', 'Demon']

shuffle(names)

let actual = Math.floor(Math.random() * names.length)

export const giveMonsterName = () => {
  return names[(actual++) % names.length]
}