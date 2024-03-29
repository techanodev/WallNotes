import express from 'express';

import routes from './routes/routes';
import http = require('http');
import cors = require('cors');
import NotesSockets from './sockets/notes.sockets';
import mongoose from 'mongoose';

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.raw());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
routes.init(app);

const server = http.createServer(app);

const socket = new NotesSockets(server);
socket.init();

const port = Number.parseInt(process.env.APP_PORT ?? '8000');
const host = process.env.APP_HOST ?? '0.0.0.0';

server.listen(port, host, () => {
  console.log(`App started at http://${host}:${port}`);
  const url = process.env.APP_DB;
  console.log(url);
  mongoose
    .connect(url)
    .catch((error) => {
      console.error(error);
    })
    .then((result) => {
      console.log(result);
    });
});
