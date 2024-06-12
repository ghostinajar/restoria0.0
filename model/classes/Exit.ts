// Exit
import mongoose from 'mongoose';
import echoSchema, { IEcho } from './Echo.js';

const { Schema } = mongoose;

export interface IExit {
    desinationZone: mongoose.Types.ObjectId;
    desinationRoom: mongoose.Types.ObjectId;
    isHidden: Boolean;
    isClosed: Boolean;
    isLocked: Boolean;
    keyItemBlueprint: mongoose.Types.ObjectId;
    keyItemZone: mongoose.Types.ObjectId;
    echoes: {
        unlock : IEcho;
        open : IEcho;
        close : IEcho;
    }
}

const exitSchema = new Schema({
    destinationZone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'
    },
    destinationRoom: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    isHidden: Boolean,
    isClosed: Boolean,
    isLocked: Boolean,
    keyItemBlueprint: {
        type: Schema.Types.ObjectId,
        ref: 'ItemBlueprint'
    },
    keyItemZone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'
    },
    echoes: {
        unlock: {
            type: echoSchema,
            default: () => ({})
        },
        open: {
            type: echoSchema,
            default: () => ({})
        },
        close: {
            type: echoSchema,
            default: () => ({})
        },
    },
}, { _id: false });

export default exitSchema;