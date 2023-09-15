import { Server } from "socket.io";
import { User } from "../types/User.ts";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

const users: Map<string, User> = new Map();

io.attach(3000);

io.on("connection", (socket) => {
  // ...
  //console.log(socket);
  socket.on("join", (profile: User["profile"]) => {
    const id = (Math.random() * 1000).toString();
    const user = {
      id,
      profile,
    };
    users.set(id, user);
    socket.emit("joinComplete", user);
  });
  socket.on("updateCursor", (user: User) => {
    users.set(user.id, user);
  });

  setInterval(() => {
    //console.log(Array.from(users.entries()));
    socket.broadcast.emit("broadcastCursor", Array.from(users.entries()));
  }, 200);
});
