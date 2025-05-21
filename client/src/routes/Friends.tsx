import styles from "./Friends.module.css";
import SearchUser from "./FriendsComponents/SearchUser";
import FriendRequests from "./FriendsComponents/FriendRequests";
import FriendList from "./FriendsComponents/FriendList";
import { createContext, useContext, useEffect, useState } from "react";
import { useFetchGet } from "../components/useFetchGet";

const FriendContext = createContext<{
  friendList: Array<any>;
  setFriendList: React.Dispatch<any>;
  refreshFriendList: number;
  setRefreshFriendList: React.Dispatch<any>;
  setFriendRequestCount: React.Dispatch<any>;
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
  const [friendRequestCount, setFriendRequestCount] = useState<number>(0);
  const { error, loading } = useFetchGet(
    { link: "friends/requests_count", dependecy: [view] },
    setFriendRequestCount
  );

  console.log(JSON.stringify(friendRequestCount));

  if (error) return <>{error}</>;
  if (loading) return <>loading</>;

  return (
    <main className={styles["main"]}>
      <h1>Friends</h1>
      <FriendContext.Provider
        value={{
          friendList,
          setFriendList,
          refreshFriendList,
          setRefreshFriendList,
          setFriendRequestCount,
        }}
      >
        <button
          value="Friend List"
          onClick={(e) => setView(e.currentTarget.value)}
        >
          Friend List
        </button>
        <button value="Search" onClick={(e) => setView(e.currentTarget.value)}>
          Search User
        </button>
        <button
          className={
            styles[friendRequestCount > 0 ? "friend-requests-button" : ""]
          }
          value="Friend Request"
          onClick={(e) => setView(e.currentTarget.value)}
        >
          Friend Request
        </button>
        {view === "Friend List" && <FriendList />}
        {view === "Search" && <SearchUser />}
        {view === "Friend Request" && <FriendRequests />}
      </FriendContext.Provider>
    </main>
  );
}
