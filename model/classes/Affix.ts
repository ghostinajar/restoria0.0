import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IAffix {
  affixType: string;
  value: number;
  currentTweak?: number;
  secondsRemaining?: number;
}

const affixSchema = new Schema<IAffix>({
  affixType: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  currentTweak: Number,
  secondsRemaining: Number,
});

export default affixSchema;
