import { useState, useEffect } from "react";
import styles from "./FriendList.module.css";
import { useFetchGetExternal } from "../../components/useFetchGet";
import { useFriendContext } from "../FriendsComponents/FriendContext";
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

function SearchFilter({
  setFilterFriendsOn,
}: {
  setFilterFriendsOn: setFilterFriendsOn;
}) {
  return (
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
  );
}

function FriendListContainer({ friendList }: { friendList: FriendList }) {
  const navigate = useNavigate();
  return (
    <div className={styles["friend-list-container"]}>
      {friendList.length !== 0 ? (
        <ul className={styles["friend-list"]}>
          {friendList.map((value) => {
            return (
              <li
                key={value.username}
                className={styles["friend-list-item"]}
                onClick={() => navigate(`/message/${value.username}`)}
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
  );
}

interface FriendListSection {
  setFilterFriendsOn: setFilterFriendsOn;
  friendList: FriendList;
}
function FriendListSection({
  setFilterFriendsOn,
  friendList,
}: FriendListSection) {
  return (
    <section className={styles.section}>
      <h2 id="Page-Title">Friend List</h2>
      <SearchFilter setFilterFriendsOn={setFilterFriendsOn} />
      <FriendListContainer friendList={friendList} />
    </section>
  );
}

export default function FriendList() {
  const [filterFriendsOn, setFilterFriendsOn] = useState("");
  const { friendList, setFriendList, refreshFriendList } = useFriendContext();
  const [fetchedData, setFetchedData] = useState<unknown>(null);
  const { loading, error } = useFetchGetExternal({
    link: "friends/",
    dependecy: [refreshFriendList],
    setFetchedData: setFetchedData,
  });

  useEffect(() => {
    if (
      fetchedData &&
      typeof fetchedData === "object" &&
      "error" in fetchedData &&
      "friends" in fetchedData &&
      typeof fetchedData.friends === "object" &&
      fetchedData.friends &&
      "friends" in fetchedData.friends &&
      Array.isArray(fetchedData.friends.friends)
    ) {
      if (loading === false && fetchedData.error) {
        localStorage.clear();
        return;
      }
      if (loading === false) {
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFriendsOn, fetchedData, refreshFriendList]);

  if (loading) return <>Loading</>;
  if (error)
    return (
      <section>
        <span>You are currently not signed in! </span>
        <Link to="/log_in">Log in here</Link>
        <span> or </span>
        <Link to="/sign_up">Sign up here</Link>
      </section>
    );

  return (
    <FriendListSection
      friendList={friendList}
      setFilterFriendsOn={setFilterFriendsOn}
    />
  );
}
