import { useState, useEffect } from "react";
import styles from "./FriendList.module.css";
import { useFetchGet } from "../../components/useFetchGet";
import { useFriendContext } from "../Friends";
import { Link, useNavigate } from "react-router-dom";

type NewType = {
  list: {
    [key: string]: string;
  }[];
  search: string;
  filterOnProperty: string;
};

function filterList({ list, search, filterOnProperty }: NewType) {
  if (search !== "") {
    return list.filter((e) =>
      e[filterOnProperty].toLowerCase().startsWith(search.toLowerCase())
    );
  }
  return list;
}

export default function FriendList() {
  const navigate = useNavigate();
  const [filterFriendsOn, setFilterFriendsOn] = useState("");
  const { friendList, setFriendList, refreshFriendList } = useFriendContext();
  const [fetchedData, setFetchedData] = useState<any>(null);
  const { loading, error } = useFetchGet(
    {
      link: "friends/",
      dependecy: [refreshFriendList],
    },
    setFetchedData
  );

  useEffect(() => {
    if (loading === false && fetchedData.err) {
      localStorage.clear();
      return;
    }
    if (loading === false && typeof fetchedData === "object") {
      console.log("render");

      const friends: { username: string }[] = fetchedData.friends.friends;
      if (Array.isArray(friends))
        console.log("checking if friends is an array");

      if (friends.length > 0) {
        setFriendList(
          filterList({
            filterOnProperty: "username",
            list: friends,
            search: filterFriendsOn,
          })
        );
      }
    }
  }, [filterFriendsOn, fetchedData, refreshFriendList]);

  if (loading) return <></>;
  if (error)
    return (
      <section>
        <h3>ERROR!</h3>
      </section>
    );

  if (fetchedData.err === "Currently not signed in") {
    return (
      <section>
        <span>You are currently not signed in! </span>
        <Link to="/log_in">Log in here</Link>
        <span> or </span>
        <Link to="/sign_up">Sign up here</Link>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <h2>Friend List</h2>
      <search className={styles["friend-list-search"]}>
        <label htmlFor="filterFriends">Filter Search: </label>
        <input
          type="text"
          name="filterFriends"
          id="filterFriends"
          placeholder="Filter Friends"
          onChange={(event) => setFilterFriendsOn(event.target.value)}
        />
      </search>

      <div className={styles["friend-list-container"]}>
        {friendList.length !== 0 ? (
          <ul className={styles["friend-list"]}>
            {friendList.map((value) => {
              return (
                <li
                  key={value.username}
                  className={styles["friend-list-item"]}
                  onClick={() => navigate(`/profile/${value.username}`)}
                >
                  <span
                    className={styles["friend-list-item-value"]}
                    onClick={() => navigate(`/profile/${value.username}`)}
                  >
                    {value.username}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <span>No friends were found</span>
        )}
      </div>
    </section>
  );
}
