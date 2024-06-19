import { IItem } from "../model/classes/Item";

// Equipped
interface IEquipped {
  arms: IItem | null;
  body: IItem | null;
  ears: IItem | null;
  feet: IItem | null;
  finger1: IItem | null;
  finger2: IItem | null;
  hands: IItem | null;
  head: IItem | null;
  held: IItem | null;
  legs: IItem | null;
  neck: IItem | null;
  shield: IItem | null;
  shoulders: IItem | null;
  waist: IItem | null;
  wrist1: IItem | null;
  wrist2: IItem | null;
  weapon1: IItem | null;
  weapon2: IItem | null;
}

export default IEquipped