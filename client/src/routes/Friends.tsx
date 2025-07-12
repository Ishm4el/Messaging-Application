/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./Friends.module.css";
import SearchUser from "./FriendsComponents/SearchUser";
import FriendRequests from "./FriendsComponents/FriendRequests";
import FriendList from "./FriendsComponents/FriendList";
import { useFetchGetExternal } from "../components/useFetchGet";
import { FriendContext } from "./FriendsComponents/FriendContext";
import { useState } from "react";
import { mainStyle } from "../utility/cssDetermine";

function FriendsMain({
  friendList,
  setFriendList,
  refreshFriendList,
  setRefreshFriendList,
  setFriendRequestCount,
  setView,
  view,
  friendRequestCount,
}) {
  return (
    <div className={styles["container"]}>
      <h1>Braid</h1>
      <FriendContext.Provider
        value={{
          friendList,
          setFriendList,
          refreshFriendList,
          setRefreshFriendList,
          setFriendRequestCount,
        }}
      >
        <ul className={styles["ul"]}>
          <li className={styles["li"]}>
            <button
              value="Friend List"
              onClick={(e) => setView(e.currentTarget.value)}
            >
              Friends
            </button>
          </li>
          <li>
            <button
              value="Search"
              onClick={(e) => setView(e.currentTarget.value)}
            >
              Search User
            </button>
          </li>
          <li>
            <button
              className={
                styles[friendRequestCount > 0 ? "friend-requests-button" : ""]
              }
              value="Friend Request"
              onClick={(e) => setView(e.currentTarget.value)}
            >
              Friend Request
            </button>
          </li>
        </ul>
        {view === "Friend List" && <FriendList />}
        {view === "Search" && <SearchUser />}
        {view === "Friend Request" && <FriendRequests />}
      </FriendContext.Provider>
    </div>
  );
}

export default function Friends() {
  const [friendList, setFriendList] = useState<Array<any>>([]);
  const [refreshFriendList, setRefreshFriendList] = useState(0);
  const [view, setView] = useState<string>("Friend List");
  const [friendRequestCount, setFriendRequestCount] = useState<number>(0);
  const { error, loading } = useFetchGetExternal({
    link: "friends/requests_count",
    dependecy: [view],
    setFetchedData: setFriendRequestCount,
  });

  console.log(JSON.stringify(friendRequestCount));

  return (
    <main className={styles[mainStyle]}>
      {error ? (
        <>{JSON.stringify(error)}</>
      ) : loading ? (
        <>Loading</>
      ) : (
        <FriendsMain
          friendList={friendList}
          refreshFriendList={refreshFriendList}
          setFriendList={setFriendList}
          setFriendRequestCount={setFriendRequestCount}
          setRefreshFriendList={setRefreshFriendList}
          setView={setView}
          friendRequestCount={friendRequestCount}
          view={view}
        />
      )}
    </main>
  );
}
