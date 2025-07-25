import fetchPut from "../../components/fetchPut";
import { UseFetchGetInternal } from "../../components/useFetchGet";
import { useFriendContext } from "../FriendsComponents/FriendContext";
import styles from "./FriendRequests.module.css";

interface Fetched {
  fetchedData: {
    [key: string]: unknown;
  };
  setFetchedData: React.Dispatch<
    React.SetStateAction<{
      [key: string]: unknown;
    }>
  >;
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
        if (
          fetchedData &&
          typeof fetchedData === "object" &&
          "requests" in fetchedData &&
          Array.isArray(fetchedData.requests)
        ) {
          fetchedData.requests.splice(index, 1);
          setFetchedData({
            ...fetchedData,
          });
        }
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
  fetchedData: { [key: string]: unknown; requests: { username: string }[] };
  setFetchedData: React.Dispatch<
    React.SetStateAction<{
      [key: string]: unknown;
    }>
  >;
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
            link="friends/acceptFriendRequest"
            fetchedData={fetchedData}
            setFetchedData={setFetchedData}
          />
          <FriendRequestButton
            index={index}
            label="Reject"
            style="friend-request-reject"
            username={value.username}
            link="friends/decline_friend_request"
            fetchedData={fetchedData}
            setFetchedData={setFetchedData}
          />
        </li>
      ))}
    </ul>
  );
}

export default function FriendRequests() {
  const { error, fetchedData, loading, setFetchedData } = UseFetchGetInternal({
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
      {(fetchedData !== null &&
        fetchedData !== undefined &&
        typeof fetchedData === "object" &&
        "requests" in fetchedData &&
        Array.isArray(fetchedData.requests) &&
        fetchedData.requests.length > 0 && (
          <FriendRequestList
            fetchedData={
              fetchedData as {
                [key: string]: unknown;
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
