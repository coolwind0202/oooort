import styles from "./Users.module.css";
import type { User } from "../types/User";

export const Users = ({ users }: { users: User[] }) => {
  return (
    <ul className={styles.UserList}>
      {users.map((user) => (
        <li key={user.id}>
          <div className={styles.User}>
            <div
              className={styles.UserColorCircle}
              style={{ backgroundColor: user.profile.color }}
            ></div>
            <div className={styles.UserName}>{user.profile.name}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export type { User };
