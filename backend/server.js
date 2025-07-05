const express = require('express');
const http = require('http'); 
const socketIO = require('socket.io');
const app = express();
require('dotenv').config();
const cors = require('cors');

const server = http.createServer(app); 
const io = socketIO(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const teamRoutes = require('./routes/teamRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');



const connectDB = require('./config/db');
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);

io.on('connection', (socket) => {
  console.log(` New client connected: ${socket.id}`);

  socket.on('taskStatusUpdated', (updatedTask) => {
    socket.broadcast.emit('taskStatusUpdated', updatedTask);
  });

  socket.on('newComment', (comment) => {
    socket.broadcast.emit('newComment', comment);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.set('io', io);


const port = process.env.PORT;
server.listen(port,()=>{
    console.log(`app listening at port ${port}`);
});