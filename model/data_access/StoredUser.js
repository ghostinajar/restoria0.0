import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose;

// the user (aka "Author") lacks most of the data that a character has, but is playable, and stores the user's auth info
const storedUserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // as a salted hash
    salt: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isTeacher: { type: Boolean, default: false },
    location: {
        zoneId: {
            type: Schema.Types.ObjectId,
            ref: 'StoredZone'
        },
        roomId: String
    },
    pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
    creationDate: {
        type: Date,
        default: Date.now
    },
    lastLogin: Date,
    hoursPlayed: { type: Number, default: 0 },
    description: {
        look: String,
        examine: String,
        study: String,
        research: String
    },
    characters: [
        {
            type: Schema.Types.ObjectId,
            ref: 'StoredCharacter'
        }
    ],
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'StoredUser'
        }
    ],
});

storedUserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};

const StoredUser = model('StoredUser', storedUserSchema);
export default StoredUser;