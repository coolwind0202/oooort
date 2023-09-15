import { Server } from "socket.io";
const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    },
});
const users = new Map();
io.attach(3000);
io.on("connection", (socket) => {
    // ...
    //console.log(socket);
    socket.on("join", (user) => {
        users.set(user.id, user);
    });
    socket.on("updateCursor", (user) => {
        users.set(user.id, user);
    });
    setInterval(() => {
        console.log(Array.from(users.entries()));
        //socket.broadcast.emit("broadcastCursor", Array.from(users.entries()));
    }, 500);
});
