import useFecthGet from "../../components/useFetchGet";
import styles from "./FriendRequests.module.css";

export default function FriendRequests() {
  const { error, fetchedData, loading } = useFecthGet({
    link: "http://localhost:3000/friends/requests",
  });

  if (loading) return <span>loading</span>;
  if (error) return <span>Error</span>;
  console.log(fetchedData);

  return (
    <>
      {Array.isArray(fetchedData.requests) &&
        fetchedData.requests.length > 0 && (
          <section className={styles["friend-request-section"]}>
            <h2>Your Friend Requests</h2>
            <ul className={styles["friend-request-list"]}>
              {fetchedData.requests.map((value) => (
                <li
                  key={value.username}
                  className={styles["friend-request-list-item"]}
                >
                  <span className={styles["friend-request-list-username"]}>
                    {value.username}
                  </span>
                  <button
                    className={styles["friend-request-accept"]}
                    onClick={() => {
                      fetch(
                        "http://localhost:3000/friends/acceptFriendRequest",
                        {
                          credentials: "include",
                          headers: { "Content-Type": "application/json" },
                          mode: "cors",
                          method: "PUT",
                          body: JSON.stringify({ username: value.username }),
                        }
                      )
                        .then((res) => res.json())
                        .then((res) => {
                          console.log("Friend Request Acceptected!");
                          console.log(res);
                        });
                    }}
                  >
                    Accept
                  </button>
                  <button className={styles["friend-request-reject"]}>
                    Reject
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
    </>
  );
}
