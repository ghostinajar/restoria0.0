// Exit
import mongoose from "mongoose";
import echoSchema, { IEcho } from "./Echo.js";
import { ILocation } from "./Location.js";

const { Schema } = mongoose;

export interface IExit {
  destinationLocation: ILocation;
  toExternalZone: boolean;
  isHidden: boolean;
  isClosed: boolean;
  keyItemBlueprint?: mongoose.Types.ObjectId;
  keyItemZone?: mongoose.Types.ObjectId;
  echoes?: {
    unlock?: IEcho;
    open?: IEcho;
    close?: IEcho;
  };
}

const exitSchema = new Schema(
  {
    destinationLocation: {
      inZone: {
        type: Schema.Types.ObjectId,
        ref: "Zone",
      },
      inRoom: {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    },
    toExternalZone: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    keyItemBlueprint: {
      type: Schema.Types.ObjectId,
      ref: "ItemBlueprint",
    },
    keyItemZone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
    },
    echoes: {
      unlock: {
        type: echoSchema,
        default: () => ({}),
      },
      open: {
        type: echoSchema,
        default: () => ({}),
      },
      close: {
        type: echoSchema,
        default: () => ({}),
      },
    },
  },
  { _id: false }
);

export default exitSchema;
