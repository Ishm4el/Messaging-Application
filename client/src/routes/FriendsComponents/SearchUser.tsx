import { useState } from "react";
import styles from "./SearchUser.module.css";

interface Found {
  username: string;
  requests: { username?: string }[];
  friends: { username?: string }[];
}

type FoundArray = Array<Found>;

function PutButton({
  username,
  fetchAt,
  label,
  buttonName,
}: {
  username: string;
  fetchAt: string;
  label: string;
  buttonName: string;
}) {
  return (
    <button
      value={username}
      name={buttonName}
      className={styles["search-user-list-add"]}
      onClick={() => {
        fetch(fetchAt, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
          body: JSON.stringify({ username: username }),
        });
        // .then((res) => res.json())
        // .then((res) => {});
      }}
    >
      {label}
    </button>
  );
}

function DisplaySearch({ found }: { found: FoundArray }) {
  return (
    <div className={styles["search-user-list-container"]}>
      {/* {JSON.stringify(found)} */}
      <ul className={styles["search-user-list"]}>
        {found.map((e) => (
          <li className={styles["search-user-list-item"]} key={e.username}>
            <span className={styles["search-user-list-username"]}>
              {e.username}
            </span>
            {JSON.stringify(e)}
            {e.friends[0]?.username ? (
              <PutButton
                buttonName="Remove Friend"
                fetchAt="http://localhost:3000/friends/remove"
                label="Remove Friend"
                username={e.username}
              />
            ) : e.requests[0]?.username ? (
              <PutButton
                username={e.username}
                fetchAt="http://localhost:3000/friends/cancel_request"
                buttonName="Cancel Friend Request"
                label="Cancel Friend Request"
              />
            ) : (
              <PutButton
                buttonName={"Send Friend Request"}
                fetchAt="http://localhost:3000/friends/request"
                label="Send Friend Request"
                username={e.username}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchForm({
  setFound,
  setInitialSearch,
  setSeekingUser,
  seekingUser,
}: {
  setFound: React.Dispatch<any>;
  setInitialSearch: React.Dispatch<any>;
  setSeekingUser: React.Dispatch<any>;
  readonly seekingUser: string;
}) {
  return (
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
  );
}

export default function SearchUser() {
  const [seekingUser, setSeekingUser] = useState<string>("");
  const [found, setFound] = useState<FoundArray>([]);
  const [initialSearch, setInitialSearch] = useState<boolean>(false);

  return (
    <section
      className={styles["search-user-section"]}
      about="Search for a new friend"
    >
      <h2 className={styles["search-user-title"]}>Search User</h2>
      <SearchForm
        seekingUser={seekingUser}
        setFound={setFound}
        setInitialSearch={setInitialSearch}
        setSeekingUser={setSeekingUser}
      />
      {(found.length > 0 && <DisplaySearch found={found} />) ||
        (initialSearch && found.length === 0 && (
          <div className={styles["search-user-empty-container"]}>
            No users were found
          </div>
        ))}
    </section>
  );
}
