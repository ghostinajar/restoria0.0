import mongoose from 'mongoose';
import echoSchema from './Echo.js';

const { Schema } = mongoose;

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
});

export default exitSchema;