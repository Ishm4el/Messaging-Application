import styles from "./Braid.module.css";
import { Suspense, useState } from "react";

interface SetUsername {
  setSelectedUser: React.Dispatch<any>;
}

interface ListItem extends SetUsername {
  username: string;
}

function Loading() {
  return <main>LOADING!</main>;
}

function ListItem({ setSelectedUser, username }: ListItem) {
  return (
    <li
      onClick={() => {
        setSelectedUser(username);
      }}
      className={styles["list-item"]}
      tabIndex={1}
      key={username}
    >
      {username}
    </li>
  );
}

function BraidLeftPanel({ setSelectedUser }: SetUsername) {
  const usernames = ["this", "will", "be", "a", "sidebar", "and", "more"];
  return (
    <section id="sidebar" className={styles["sidebar"]}>
      <h2 id="sidebar-title" className={styles["sidebar-title"]}>
        Messages
      </h2>
      <ul>
        {usernames.map((value) => (
          <ListItem username={value} setSelectedUser={setSelectedUser} />
        ))}
      </ul>
    </section>
  );
}

function BraidContent({ username }: { username: string }) {
  return (
    <section id="content" className={styles["content"]}>
      {username ? (
        <>
          <h2>{username}</h2>
          <p
            className={
              styles[
                username === localStorage.username
                  ? "message-primary"
                  : "message-other"
              ]
            }
          >
            This is some message
          </p>
        </>
      ) : (
        <h2>Select a User to Message</h2>
      )}
    </section>
  );
}

function BraidMain() {
  const [selectedUser, setSelectedUser] = useState<string>("");
  return (
    <main
      className={
        styles[localStorage.getItem("backgroundColorSettings") || "main"]
      }
    >
      <div className={styles["all-container"]}>
        <h1>BRAID</h1>
        <div className={styles["sections-container"]}>
          <Suspense fallback={<Loading />}>
            <BraidLeftPanel setSelectedUser={setSelectedUser} />
            <BraidContent username={selectedUser} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

export default function Braid() {
  return <BraidMain />;
}
