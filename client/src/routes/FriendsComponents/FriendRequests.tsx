import fetchPut from "../../components/fetchPut";
import { useFetchGet } from "../../components/useFetchGet";
import { useFriendContext } from "../Friends";
import styles from "./FriendRequests.module.css";

const handleClick = ({
  link,
  username,
  index,
  fetchedData,
  setFetchedData,
}: {
  link: string;
  username: string;
  index: number;
  fetchedData: {
    [key: string]: any;
  };
  setFetchedData: React.Dispatch<any>;
}): void => {
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
}: {
  index: number;
  username: string;
  label: string;
  style: string;
  link: string;
  fetchedData: { [key: string]: any };
  setFetchedData: React.Dispatch<any>;
}) => {
  const { setRefreshFriendList, refreshFriendList } = useFriendContext();
  return (
    <button
      className={styles[style]}
      onClick={() => {
        handleClick({
          index,
          link,
          username,
          fetchedData,
          setFetchedData,
        });
        if (label === "Accept") setRefreshFriendList({ ...refreshFriendList });
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
    link: "http://localhost:3000/friends/requests",
  });

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  return (
    <>
      {Array.isArray(fetchedData.requests) &&
        fetchedData.requests.length > 0 && (
          <section className={styles["friend-request-section"]}>
            <h2>Your Friend Requests</h2>
            <FriendRequestList
              fetchedData={
                fetchedData as {
                  [key: string]: any;
                  requests: { username: string }[];
                }
              }
              setFetchedData={setFetchedData}
            />
          </section>
        )}
    </>
  );
}
