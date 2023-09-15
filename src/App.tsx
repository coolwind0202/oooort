import { useEffect, useRef, useState } from "react";
import "./App.css";
import { User, Users } from "./components/Users";
import { socket } from "./socket";

function App() {
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [myUserProfile, setMyUserProfile] = useState<User["profile"]>({
    color: "",
    name: "",
  });
  const [joined, setJoined] = useState(false);

  const myUser = useRef<User | null>(null);

  useEffect(() => {
    function onJoinComplete(user: User) {
      myUser.current = user;
      setJoined(true);
    }
    function onConnect() {
      console.log("connect");
    }
    function onBroadcastCursor(users: [string, User][]) {
      //console.log("update", users);
      setUsers(new Map(users));
    }
    socket.on("joinComplete", onJoinComplete);
    socket.on("connect", onConnect);
    socket.on("broadcastCursor", onBroadcastCursor);

    setInterval(() => {
      if (myUser.current != null) {
        //console.log("Update");
        socket.emit("updateCursor", myUser.current);
      }
    }, 200);

    return () => {
      socket.off("joinComplete");
      socket.off("connect");
      socket.off("broadcastCursor");
    };
  }, []);

  return joined ? (
    <div
      onMouseMove={(e) => {
        //console.log("mouse moved");
        if (myUser.current == null) return;
        myUser.current = {
          id: myUser.current.id,
          profile: myUser.current.profile,
          position: { x: e.clientX, y: e.clientY },
        };
      }}
      className="screen"
    >
      <div className="Body">
        <div className="BoxA">
          <button
            onClick={() => {
              socket.emit("updateCursor", myUser);
            }}
          >
            {" "}
            ボタン
          </button>
        </div>
        <div className="BoxB"></div>
      </div>
      <div className="Users">
        <Users users={Array.from(users.values())} />
        <input
          value={myUserProfile.name}
          onChange={(e) =>
            setMyUserProfile({ ...myUserProfile, name: e.target.value })
          }
        />
        <input
          value={myUserProfile.color}
          onChange={(e) =>
            setMyUserProfile({ ...myUserProfile, color: e.target.value })
          }
        />
      </div>
      <div className="UserCursors">
        {Array.from(users.values()).map((user) => {
          if (!user.position) return null;
          const { x, y } = user.position;
          return (
            <div
              key={user.id}
              className="UserCursor"
              style={{
                left: x,
                top: y,
                background: user.profile.color,
              }}
            >
              {user.profile.name}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>
      <input
        value={myUserProfile.name}
        onChange={(e) => {
          setMyUserProfile({ ...myUserProfile, name: e.target.value });
        }}
      />
      <input
        value={myUserProfile.color}
        onChange={(e) => {
          setMyUserProfile({ ...myUserProfile, color: e.target.value });
        }}
      />
      <button type="button" onClick={() => socket.emit("join", myUserProfile)}>
        {" "}
        送信{" "}
      </button>
    </div>
  );
}

export default App;
