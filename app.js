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

dotenv.config();
const mongodb_uri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const app = express()
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url)); // Get the directory name of the current module

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

// Setup routes
setupRoutes(app, __dirname);

// Setup socket.io
setupSocket(io);

// mongoose
mongoose.connect(mongodb_uri);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
