import mongoose from "mongoose";
import { IUser } from "../model/classes/User";

function stats (parsedCommand: string, user: IUser & mongoose.Document) {
  //show user's hp/maxhp mana/maxmana move/maxmove on one line
}

export default stats