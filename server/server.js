const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from frontend

let line =[]
let pairedMap={}
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React app origin
    methods: ["GET", "POST"]
  }
});

// Handle connection
io.on('connection', (socket) => {


  socket.on('sendMove',(move)=>{
  io.to(pairedMap[socket.id]).emit('recieveMove',move);
})

    
  console.log(`New client connected: ${socket.id}`);

  if(line.length===0)
  {
    line.push(socket.id)
    socket.emit('wait','Waiting for a person')
  }
  else
  {
    const partner = line[0];
    io.to(partner).emit('pairedUp', socket.id);
    io.to(socket.id).emit('pairedUp', partner);
    pairedMap[partner]=socket.id;
    pairedMap[socket.id]=partner;


    line.pop();
  }
  
  socket.on('disconnect', () => {
    

    console.log(`Client disconnected: ${socket.id}`);
    if(line.length>0)
        {
            if(socket.id==line[0])
            line.pop()
            else
            {
                const oldpartner = pairedMap[socket.id];
                const newpartner = line[0];
                delete pairedMap[socket.id];
                delete pairedMap[oldpartner.id];

                
                io.to(oldpartner).emit('pairedUp', newpartner);
                 io.to(newpartner).emit('pairedUp', oldpartner);
                pairedMap[oldpartner]=newpartner;
                 pairedMap[newpartner]=oldpartner;


            line.pop();

            }
        }
    else
    {
        const partner = pairedMap[socket.id];
        io.to(partner).emit('wait','waiting for another player');
        delete pairedMap[socket.id];
        delete pairedMap[partner];
        line.push(partner);
    }
  });
});



server.listen(4000, () => {
  console.log('Socket.IO server running on http://localhost:4000');
});
