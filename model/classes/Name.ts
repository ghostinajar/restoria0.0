// Name
// exists to store unique names in db for duplicate checking across users, mobs, etc.
import mongoose from "mongoose";
const { Schema, model } = mongoose;

export interface IName extends mongoose.Document {
  name: string;
}

export const nameSchema = new Schema<IName>({
  name: { type: String, required: true, unique: true },
});

const Name = model<IName>("Name", nameSchema);
export default Name;
