import styles from "./Profile.module.css";
import { useState } from "react";
import { useFetchGet } from "../../components/useFetchGet";

export function CurrentUserProfile() {
  const { error, fetchedData, loading } = useFetchGet({
    link: "profile/primary_profile",
  });
  if (loading) return <>Loading!</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return (
    <section className={styles["section"]}>
      <h2 className={styles["section-title"]}>Your Profile Page</h2>
      {fetchedData !== null && (
        <>
          <h3 className={styles["cool"]}>Username: {fetchedData.username}</h3>
          <h3>Created: {fetchedData.createdAt}</h3>
          <h3>Online: {fetchedData.online.toString()}</h3>
        </>
      )}
    </section>
  );
}
