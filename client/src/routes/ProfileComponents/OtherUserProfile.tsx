import { useCallback, useState } from "react";
import fetchPut from "../../components/fetchPut";
import { useFetchGetInternal } from "../../components/useFetchGet";
import styles from "./Profile.module.css";

export function OtherUserProfile({ username }: { username: string }) {
  const [notificationMessage, setNotifcationMessage] = useState("");
  const { error, loading, fetchedData } = useFetchGetInternal<OtherUserProfile>(
    {
      link: `profile/other_profile/${username}`,
      dependecy: [notificationMessage],
    }
  );

  const onClickHandler = useCallback(
    (link: string, buttonSetNotification: string) =>
      fetchPut({
        link,
        body: { username: fetchedData!.username },
      }).then((res) => {
        if (res.status === 200) setNotifcationMessage(buttonSetNotification);
      }),
    [fetchedData]
  );

  if (loading) return <span>loading</span>;
  if (error) return <span>error!</span>;
  if (fetchedData) {
    return (
      <section className={styles["section"]}>
        {fetchedData !== null && (
          <>
            <h2 className={styles["section-title"]}>
              User {fetchedData.username}'s Profile Page
            </h2>
            <div
              className={`${styles["notification"]} ${
                styles[notificationMessage ? "notification-show" : ""]
              }`}
              onTransitionEnd={() => {
                setNotifcationMessage("");
              }}
            >
              {notificationMessage}
            </div>
            <div className={styles["card"]}>
              <h3>Username: {fetchedData.username}</h3>
              <h3>Created: {JSON.stringify(fetchedData.createdAt)}</h3>
              <h3>Online: {fetchedData.online.toString()}</h3>
              {fetchedData.friends[0] && <h3>Relationship: Friends</h3>}
              {fetchedData.requestsRelation[0] ? (
                <div className={styles["friend-options"]}>
                  <button
                    onClick={() =>
                      onClickHandler(
                        "friends/acceptFriendRequest",
                        "Accepted Friend Request"
                      )
                    }
                  >
                    Accept Friend Request
                  </button>
                  <button
                    onClick={() =>
                      onClickHandler(
                        "friends/acceptFriendRequest",
                        "Accepted Friend Request"
                      )
                    }
                  >
                    Reject Friend Request
                  </button>
                </div>
              ) : fetchedData.friends[0] ? (
                <button
                  onClick={() =>
                    onClickHandler(
                      "friends/remove_friend",
                      "Friend has been removed"
                    )
                  }
                >
                  Remove Friend
                </button>
              ) : fetchedData.requests[0] ? (
                <button
                  onClick={() =>
                    onClickHandler(
                      "friends/cancel_friend_request",
                      "Friend Request has been canceled"
                    )
                  }
                >
                  Cancel Friend Request
                </button>
              ) : (
                <button
                  onClick={() =>
                    onClickHandler("friends/request", "Friend Request Sent!")
                  }
                >
                  Send Friend Request
                </button>
              )}
            </div>
          </>
        )}
      </section>
    );
  }
  return <>ERROR</>;
}
