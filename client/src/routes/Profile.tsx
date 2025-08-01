import styles from "./ProfileComponents/Profile.module.css";
import { useParams } from "react-router-dom";
import { OtherUserProfile } from "./ProfileComponents/OtherUserProfile";
import { CurrentUserProfile } from "./ProfileComponents/CurrentUserProfile";
import { mainStyle } from "../utility/cssDetermine";
// import { mainStyle } from "../utility/cssDetermine";

export default function Profile() {
  const { username } = useParams();

  console.log(localStorage.getItem("backgroundColorSettings"));

  return (
    <main className={styles[mainStyle]}>
      {username !== undefined &&
      localStorage.getItem("username") !== undefined &&
      username !== undefined &&
      username === localStorage.getItem("username") ? (
        <CurrentUserProfile />
      ) : username !== undefined &&
        username !== localStorage.getItem("username") ? (
        <OtherUserProfile username={username} />
      ) : (
        <span className={styles["span-error"]}>Error</span>
      )}
    </main>
  );
}
