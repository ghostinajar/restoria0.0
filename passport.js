const passport = require('passport');
const LocalStrategy = require('passport-local');
const Author = require('../model/Author.js');

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try {
        const author = await Author.findOne({ username });
        if (!author) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }

        const isPasswordValid = await author.comparePassword(password);
        if (!isPasswordValid) {
            return cb(null, false, { message: 'Incorrect username or password.' });
        }
        
        return cb(null, author);
    } catch (err) {
        return cb(err);
    }
}));
