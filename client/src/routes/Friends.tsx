import styles from "./Friends.module.css";
import SearchUser from "./FriendsComponents/SearchUser";
import FriendRequests from "./FriendsComponents/FriendRequests";
import FriendList from "./FriendsComponents/FriendList";

export default function Friends() {
  return (
    <main className={styles["main"]}>
      <h1>Friends</h1>
      <SearchUser />
      <FriendRequests />
      <FriendList />
    </main>
  );
}
