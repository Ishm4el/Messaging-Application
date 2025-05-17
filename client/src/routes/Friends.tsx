import styles from "./Friends.module.css";
import SearchUser from "./FriendsComponents/SearchUser";
import FriendRequests from "./FriendsComponents/FriendRequests";
import FriendList from "./FriendsComponents/FriendList";
import { createContext, useContext, useState } from "react";

const FriendContext = createContext<{
  friendList: Array<any>;
  setFriendList: React.Dispatch<any>;
  refreshFriendList: number;
  setRefreshFriendList: React.Dispatch<any>;
} | null>(null);

export function useFriendContext() {
  const friendContext = useContext(FriendContext);
  if (!friendContext) {
    throw new Error(
      "useFriendContext has to be used within <FriendContext.Provider>!"
    );
  }
  return friendContext;
}

export default function Friends() {
  const [friendList, setFriendList] = useState<Array<any>>([]);
  const [refreshFriendList, setRefreshFriendList] = useState(0);
  const [view, setView] = useState<string>("Friend List");

  return (
    <main className={styles["main"]}>
      <h1>Friends</h1>
      <FriendContext.Provider
        value={{
          friendList,
          setFriendList,
          refreshFriendList,
          setRefreshFriendList,
        }}
      >
        <button value="Search" onClick={(e) => setView(e.currentTarget.value)}>
          Search User
        </button>
        <button
          value="Friend Request"
          onClick={(e) => setView(e.currentTarget.value)}
        >
          Friend Request
        </button>
        <button
          value="Friend List"
          onClick={(e) => setView(e.currentTarget.value)}
        >
          Friend List
        </button>
        {view === "Friend List" && <FriendList />}
        {view === "Search" && <SearchUser />}
        {view === "Friend Request" && <FriendRequests />}
      </FriendContext.Provider>
    </main>
  );
}
