import mongoose from "mongoose";
const { Schema, model } = mongoose;

export interface IName {
  name: string;
}

export const nameSchema = new Schema<IName>({
  name: { type: String, required: true, unique: true },
});

const Name = model<IName>("Name", nameSchema);
export default Name;
