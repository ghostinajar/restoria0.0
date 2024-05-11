import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const authorSchema = new Schema({
    name: String,
    isAdmin: Boolean,
    email: String,
    password: String,
    location: {
        zoneId: String,
        roomId: String
    },
    pronouns: Number, // 0 = he/him, 1 = she/her, 2 = they/them, 3 = it/it
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date,
    hoursPlayed: Number,
    description: {
        look: String,
        examine: String,
        study: String,
        research: String
    },
    characters: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Character'
        }
    ],
});

const Author = model('Author', authorSchema);
export default Author;