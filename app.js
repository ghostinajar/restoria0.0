// app
import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { Server } from "socket.io";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import setupRoutes from "./routes.js";
import setupSocket from "./socket.js";
import dotenv from "dotenv";
import logger from "./logger.js";
import User from "./model/classes/User.js";
import World from "./model/classes/World.js";
import deleteZoneById from "./util/deleteZoneById.js"

dotenv.config(); // Load environment variables from a .env file into process.env
const mongodb_uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const app = express(); // Express app
const server = createServer(app); // HTTP server
const io = new Server(server); // Socket.io server
const __dirname = dirname(fileURLToPath(import.meta.url)); // Get the directory name of the current module
logger.level = process.env.LOG_LEVEL;

// Middleware
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
const sessionMiddleware = session({
  secret: "white cat",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, //TODO set to true when app moves to https
});
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

// Setup passport
passport.use(
  new LocalStrategy(async function verify(name, password, cb) {
    try {
      // logger.debug(`Passport local strategy verifying name ${name}.`)
      name = name.toLowerCase();
      const user = await User.findOne({ username: name });
      if (!user) {
        logger.debug(`Passport local strategy couldn't find name: ${name} in Users`);
        return cb(null, false, { message: "Incorrect name or password." });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        logger.debug(`Passport local strategy couldn't verify password.`);
        return cb(null, false, { message: "Incorrect name or password." });
      }
      // logger.debug(`Passport local strategy authenticated, returning user ${user.name}.`);
      return cb(null, user); 
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    // logger.debug(`passport.serializeUser has user id ${user._id} name ${user.username}`)
    return cb(null, {
      _id: user._id,
      name: user.name,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

// Setup routes
setupRoutes(app, __dirname);

async function main() {
  // Setup mongoose
  mongoose
    .connect(mongodb_uri)
    .then(() => {
      logger.info("Connected to MongoDB");
    })
    .catch((err) => {
      logger.error("Error connecting to MongoDB", err);
    });
  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB connection error: ${err}`);
  });

  // Setup game world
  const world = new World();
  logger.info("World instantiated!");
  await world.zoneManager.addZoneById("664f8ca70cc5ae9b173969a8"); // load Restoria Town
  //setTimeout(()=>{world.zoneManager.removeZoneById('664f8ca70cc5ae9b173969a8');}, 4000);

  // Setup socket.io
  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });
  setupSocket(io);
}
main();

server.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});
