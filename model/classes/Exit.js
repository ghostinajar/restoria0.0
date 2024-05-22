import mongoose from 'mongoose';

const { Schema } = mongoose;

const exitSchema = new Schema({
    destinationRoomNumber: Number, //not an ObjectId!
    isHidden: Boolean,
    isClosed: Boolean,
    isLocked: Boolean,
    keyItemId: Number, // how can we reference an Item's ObjectId, which would be embedded in a zone?
    echoes: {
        unlock: echoSchema,
        open: echoSchema,
        close: echoSchema,
    },
});

export default exitSchema;