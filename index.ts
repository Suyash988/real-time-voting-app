import cors from 'cors';
import express from 'express';
import { Server, Socket } from 'socket.io';

type PollState = {
  question: string;
  options: {
    id: number;
    text: string;
    description: string;
    votes: string[];
  }[];
}

interface ClientToServerEvents {
  vote: (optionId:  number) => void;
  askForStateUpdate: () => void;
}

interface ServerToClientEvents {
  updateState: (state: PollState) => void;
}

interface InterServerEvents {}

interface SocketData {
  user: string;
}

const app = express();
//cors: cross-origin resource sharing
app.use(cors({ origin: 'http://localhost:5173' })); //default port for the react vite project
const server = require('http').createServer(app);
//passing these generic type parameters to the `Server` class 
// ensures data flowing through the server are correctly typed.

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  }
})

//this is a middlware that Socket.io uses on initiliazation to add
//the authenticated user to the socket instance. NOte: we are not
io.use(addUserToSocketDataIfAuthenticated)
app.get('/', (req, res) => {
  res.send(`<h1>Hello World</h1>`);
});

server.listen(8000, () => {
  console.log('listening on *:8000');
});
