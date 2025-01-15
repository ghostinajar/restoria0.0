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
    hiddenByDefault: {
        type: Boolean,
        default: false,
    },
    closedByDefault: {
        type: Boolean,
        default: false,
    },
    isClosed: {
        type: Boolean,
        default: false,
    },
    keyItemBlueprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemBlueprint",
        default: null,
    },
    isLocked: {
        type: Boolean,
        default: false,
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
exitSchema.pre("save", function (next) {
    this.isClosed = this.closedByDefault;
    if (this.keyItemBlueprint) {
        this.isLocked = true;
    }
    else {
        this.isLocked = false;
    }
    next();
});
export default exitSchema;
