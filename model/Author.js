import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { Schema, model } = mongoose;

// the author lacks most of the data that a character has, but is playable, and stores the user's auth info
const authorSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // as a salted hash
    isAdmin: { type: Boolean, default: false },
    isTeacher: { type: Boolean, default: false },
    location: {
        zoneId: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        },
        roomId: String
    },
    pronouns: Number, // 0 = it/it, 1 = he/him, 2 = she/her, 3 = they/them
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
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Author'
        }
    ],
});

authorSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        if (this.password.length < 8) {
            throw new Error('Password must be at least 8 characters long.');
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

authorSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        throw err;
    }
};

const Author = model('Author', authorSchema);
export default Author;