import { useState, useEffect } from "react";
import styles from "./FriendList.module.css";
import { useFetchGet } from "../../components/useFetchGet";
import { useFriendContext } from "../Friends";

export default function FriendList() {
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

  const [filterFriendsOn, setFilterFriendsOn] = useState("");
  const { friendList, setFriendList, refreshFriendList } = useFriendContext();
  const { loading, error, fetchedData } = useFetchGet({
    link: "http://localhost:3000/friends/",
    dependecy: [refreshFriendList],
  });

  useEffect(() => {
    console.log("in use effect again!");

    if (loading === false) {
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

  if (loading)
    return (
      <section>
        <h3>LOADING</h3>
      </section>
    );
  if (error)
    return (
      <section>
        <h3>ERROR!</h3>
      </section>
    );

  return (
    <section className={styles.section}>
      <>
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
                  >
                    <span className={styles["friend-list-item-value"]}>
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
      </>
    </section>
  );
}
