// Exit
import mongoose from "mongoose";
import echoSchema from "./Echo.js";
const { Schema } = mongoose;
const exitSchema = new Schema({
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
}, { _id: false });
export default exitSchema;
