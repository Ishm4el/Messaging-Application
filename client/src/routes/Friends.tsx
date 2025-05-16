import styles from "./Friends.module.css";
import SearchUser from "./FriendsComponents/SearchUser";
import FriendRequests from "./FriendsComponents/FriendRequests";
import FriendList from "./FriendsComponents/FriendList";
import { createContext, useContext, useState } from "react";

const FriendContext = createContext<{
  friendList: Array<any>;
  setFriendList: React.Dispatch<any>;
  refreshFriendList: any;
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
  const [refreshFriendList, setRefreshFriendList] = useState({});

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
        <SearchUser />
        <FriendRequests />
        <FriendList />
      </FriendContext.Provider>
    </main>
  );
}
