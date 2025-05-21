import fetchPut from "../../components/fetchPut";
import { useFetchGet } from "../../components/useFetchGet";
import { useFriendContext } from "../Friends";
import styles from "./FriendRequests.module.css";

interface Fetched {
  fetchedData: {
    [key: string]: any;
  };
  setFetchedData: React.Dispatch<any>;
}

interface HandleClick extends Fetched {
  link: string;
  username: string;
  index: number;
}

interface FriendRequestButton extends HandleClick {
  label: string;
  style: string;
}

const handleClick = ({
  link,
  username,
  index,
  fetchedData,
  setFetchedData,
}: HandleClick): Promise<string> => {
  return new Promise((res) => {
    fetchPut({
      link,
      body: { username },
    })
      .then((res) => {
        res.json();
      })
      .then(() => {
        fetchedData.requests.splice(index, 1);
        setFetchedData({
          ...fetchedData,
        });
      })
      .finally(() => res("done"));
  });
};

const FriendRequestButton = ({
  index,
  username,
  label,
  style,
  link,
  fetchedData,
  setFetchedData,
}: FriendRequestButton) => {
  const { setRefreshFriendList, refreshFriendList, setFriendRequestCount } =
    useFriendContext();
  return (
    <button
      className={styles[style]}
      onClick={async () => {
        handleClick({
          index,
          link,
          username,
          fetchedData,
          setFetchedData,
        }).then((res) => {
          console.log(res);
          if (label === "Accept") {
            setRefreshFriendList(refreshFriendList + 1);
            setFriendRequestCount((prev: number) => prev - 1);
          }
        });
      }}
    >
      {label}
    </button>
  );
};

function FriendRequestList({
  fetchedData,
  setFetchedData,
}: {
  fetchedData: { [key: string]: any; requests: { username: string }[] };
  setFetchedData: React.Dispatch<any>;
}) {
  return (
    <ul className={styles["friend-request-list"]}>
      {fetchedData.requests.map((value, index) => (
        <li key={value.username} className={styles["friend-request-list-item"]}>
          <span className={styles["friend-request-list-username"]}>
            {value.username}
          </span>
          <FriendRequestButton
            index={index}
            label="Accept"
            style="friend-request-accept"
            username={value.username}
            link="http://localhost:3000/friends/acceptFriendRequest"
            fetchedData={fetchedData}
            setFetchedData={setFetchedData}
          />
          <FriendRequestButton
            index={index}
            label="Reject"
            style="friend-request-reject"
            username={value.username}
            link="http://localhost:3000/friends/decline_friend_request"
            fetchedData={fetchedData}
            setFetchedData={setFetchedData}
          />
        </li>
      ))}
    </ul>
  );
}

export default function FriendRequests() {
  const { error, fetchedData, loading, setFetchedData } = useFetchGet({
    link: "friends/requests",
  });

  if (loading)
    return (
      // <span>loading</span>
      <></>
    );
  if (error) return <span>Error</span>;
  return (
    <section className={styles["friend-request-section"]}>
      <h2>Your Friend Requests</h2>
      {(Array.isArray(fetchedData.requests) &&
        fetchedData.requests.length > 0 && (
          <FriendRequestList
            fetchedData={
              fetchedData as {
                [key: string]: any;
                requests: { username: string }[];
              }
            }
            setFetchedData={setFetchedData}
          />
        )) || (
        <h3>You currently do not have any friend requests at this moment</h3>
      )}
    </section>
  );
}
