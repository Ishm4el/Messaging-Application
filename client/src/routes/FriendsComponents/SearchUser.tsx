import { useState } from "react";
import styles from "./SearchUser.module.css";

export default function SearchUser() {
  const [seekingUser, setSeekingUser] = useState<string>("");
  const [found, setFound] = useState<Array<{ username: string }>>([]);
  const [initialSearch, setInitialSearch] = useState<boolean>(false);

  return (
    <section
      className={styles["search-user-section"]}
      about="Search for a new friend"
    >
      <h2 className={styles["search-user-title"]}>Search User</h2>
      <search className="search-user-search">
        <form
          className={styles["search-user-form"]}
          onSubmit={(ev) => {
            ev.preventDefault();
            fetch(`http://localhost:3000/friends/search/${seekingUser}`, {
              method: "GET",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            })
              .then((value) => value.json())
              .then((value) => {
                console.log(value);
                setFound(value);
              })
              .finally(() => setInitialSearch(true));
          }}
        >
          <label htmlFor="seekingUser">Search for a user: </label>
          <input
            type="text"
            name="seekingUser"
            id="seekingUser"
            placeholder="Search Username"
            required
            value={seekingUser}
            onChange={(event) => setSeekingUser(event.target.value)}
          />
          <button type="submit">Search</button>
          <div />
          <button
            onClick={(e) => {
              e.preventDefault();
              setInitialSearch(false);
              setFound([]);
              setSeekingUser("");
            }}
          >
            X
          </button>
        </form>
      </search>
      {(found.length > 0 && (
        <div className={styles["search-user-list-container"]}>
          <ul className={styles["search-user-list"]}>
            {found.map((e) => (
              <li className={styles["search-user-list-item"]} key={e.username}>
                <span className={styles["search-user-list-username"]}>
                  {e.username}
                </span>
                <button
                  value={e.username}
                  className={styles["search-user-list-add"]}
                  onClick={() => {
                    fetch("http://localhost:3000/friends/request", {
                      method: "PUT",
                      credentials: "include",
                      headers: { "Content-Type": "application/json" },
                      mode: "cors",
                      body: JSON.stringify({ username: e.username }),
                    })
                      .then((res) => res.json())
                      .then((res) => {
                        console.log("friend request has been sent!");
                        console.log(res);
                      });
                  }}
                >
                  Add Friend
                </button>
              </li>
            ))}
          </ul>
        </div>
      )) ||
        (initialSearch && found.length === 0 && (
          <div className={styles["search-user-empty-container"]}>
            No users were found
          </div>
        ))}
    </section>
  );
}
