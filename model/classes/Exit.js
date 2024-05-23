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
    keyItem: {
        type: Schema.Types.ObjectId,
        ref: 'Item'
    },
    keyItemZone: {
        type: Schema.Types.ObjectId,
        ref: 'Zone'
    },
    echoes: {
        unlock: echoSchema,
        open: echoSchema,
        close: echoSchema,
    },
});

export default exitSchema;