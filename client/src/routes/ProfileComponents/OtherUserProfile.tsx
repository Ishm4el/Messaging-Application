import { useFetchGet } from "../../components/useFetchGet";
import styles from "./Profile.module.css";

export function OtherUserProfile({ username }: { username: string }) {
  const { error, loading, fetchedData } = useFetchGet({
    link: `profile/other_profile/${username}`,
  });
  if (loading) return <span>loading</span>;
  if (error) return <span>error!</span>;
  return (
    <section className={styles["section"]}>
      {fetchedData !== null && (
        <>
          <h2 className={styles["section-title"]}>
            User {fetchedData.username}'s Profile Page
          </h2>
          <h3>Username: {fetchedData.username}</h3>
          <h3>Created: {fetchedData.createdAt}</h3>
          <h3>Online: {fetchedData.online.toString()}</h3>
        </>
      )}
    </section>
  );
}
