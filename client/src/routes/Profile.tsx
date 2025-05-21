import { useParams } from "react-router-dom";
import { OtherUserProfile } from "./ProfileComponents/OtherUserProfile";
import { CurrentUserProfile } from "./ProfileComponents/CurrentUserProfile";

export default function Profile() {
  const { username } = useParams();
  return (
    <main>
      {(username === undefined && localStorage.getItem("username")) ||
      (username !== undefined &&
        username === localStorage.getItem("username")) ? (
        <CurrentUserProfile />
      ) : username !== undefined &&
        username !== localStorage.getItem("username") ? (
        <OtherUserProfile username={username} />
      ) : (
        <>Error</>
      )}
    </main>
  );
}
