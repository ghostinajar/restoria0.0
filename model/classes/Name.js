// Name
// exists to store unique names in db for duplicate checking across users, mobs, etc.
import mongoose from "mongoose";
const { Schema, model } = mongoose;
export const nameSchema = new Schema({
    name: { type: String, required: true, unique: true },
});
const Name = model("Name", nameSchema);
export default Name;
