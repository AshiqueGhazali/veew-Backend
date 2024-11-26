import { Server, Socket } from "socket.io";
import { createServer } from "http";

interface Rooms {
  [key: string]: string[]; // Maps room IDs to arrays of user IDs
}

export default function socketConnection(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // React frontend
      methods: ["GET", "POST"],
    },
  });

  const rooms: Rooms = {}; // Store rooms and their members

  // io.on("connection", (socket: Socket) => {
  //   console.log(`New client connected: ${socket.id}`);

  //   // Handle room joining
  //   socket.on("join-room", ({ roomId, userId }: { roomId: string; userId: string }) => {
  //     console.log(`User ${userId} joined room ${roomId}`);
      
  //     // Initialize the room if it doesn't exist
  //     if (!rooms[roomId]) {
  //       rooms[roomId] = [];
  //     }

  //     // Add the user to the room
  //     rooms[roomId].push(userId);
  //     socket.join(roomId);

  //     // Notify others in the room
  //     socket.to(roomId).emit("user-connected", userId);

  //     // Handle user disconnect
  //     socket.on("disconnect", () => {
  //       console.log(`User ${userId} disconnected from room ${roomId}`);
        
  //       if (rooms[roomId]) {
  //         // Remove the user from the room
  //         rooms[roomId] = rooms[roomId].filter((id) => id !== userId);
  //         socket.to(roomId).emit("user-disconnected", userId);
  //       }
  //     });
  //   });
  // });

  io.on("connection", (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);
  
    socket.on("join-room", ({ roomId, userId }: { roomId: string; userId: string }) => {
      console.log(`User ${userId} joined room ${roomId}`);
  
      if (!rooms[roomId]) rooms[roomId] = [];
      rooms[roomId].push(userId);
  
      socket.join(roomId);
      socket.to(roomId).emit("user-connected", userId);
  
      socket.on("disconnect", () => {
        console.log(`User ${userId} disconnected from room ${roomId}`);
        if (rooms[roomId]) {
          rooms[roomId] = rooms[roomId].filter((id) => id !== userId);
          socket.to(roomId).emit("user-disconnected", userId);
        }
      });
  
      // Handle WebRTC signaling
      socket.on("offer", ({ offer, target }) => {
        socket.to(target).emit("offer", { offer, sender: socket.id });
      });
  
      socket.on("answer", ({ answer, target }) => {
        socket.to(target).emit("answer", { answer, sender: socket.id });
      });
  
      socket.on("ice-candidate", ({ candidate, target }) => {
        socket.to(target).emit("ice-candidate", { candidate, sender: socket.id });
      });
  
      // Handle chat messages
      socket.on("message", ({ roomId, message, sender }) => {
        io.to(roomId).emit("message", { message, sender });
      });
    });
  });

  

  return io; // Optionally return the Socket.IO instance
}
