import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { Server } from 'socket.io';
import setupRoutes from './routes.js';
import setupSocket from './socket.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from './model/User.js';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables from a .env file into process.env
const mongodb_uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const app = express() // Express app
const server = createServer(app); // HTTP server
const io = new Server(server); // Socket.io server
const __dirname = dirname(fileURLToPath(import.meta.url)); // Get the directory name of the current module

// Middleware
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
const sessionMiddleware = session({
  secret: 'white cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } //TODO set to true when app moves to https
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));


// Setup passport
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
      const user = await User.findOne({ username });
      if (!user) {
          return cb(null, false, { message: 'Incorrect username or password.' });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
          console.log('Incorrect password');
          return cb(null, false, { message: 'Incorrect username or password.' });
      }
      
      return cb(null, user);
  } catch (err) {
      return cb(err);
  }
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


// Setup routes
setupRoutes(app, __dirname);

// Setup socket.io
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});
setupSocket(io);

// mongoose
mongoose.connect(mongodb_uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });
mongoose.connection.on('error', err => {
  console.error(`MongoDB connection error: ${err}`);
});
  

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
