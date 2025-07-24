import styles from "./Profile.module.css";
import { UseFetchGetInternal } from "../../components/useFetchGet";
import { useNavigate } from "react-router-dom";
import fetchPost from "../../components/fetchPost";

export function CurrentUserProfile() {
  const navigate = useNavigate();
  const { error, fetchedData, loading } = UseFetchGetInternal<{
    username: string;
    online: boolean;
    createdAt: Date;
  } | null>({
    link: "profile/primary_profile",
  });

  const formUpdateUserSettings = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const formData = new FormData(ev.currentTarget);
    console.log(formData.get("background-color-settings"));
    fetchPost({
      link: "profile/settings",
      body: {
        backgroundColorSettings: formData.get("background-color-settings"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        localStorage.setItem(
          "backgroundColorSettings",
          res.backgroundColorSettings
        );
        navigate(0);
      });
  };

  if (loading) return <>Loading!</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  if (fetchedData) {
    return (
      <>
        <section className={styles["section"]}>
          <h2 className={styles["section-title"]}>Personal Profile</h2>
          {fetchedData !== null && (
            <div className={styles["card"]}>
              <h3 className={styles["cool"]}>
                Username: {fetchedData.username}
              </h3>
              <h3>Created: {fetchedData.createdAt.toString()}</h3>
              <h3>Online: {fetchedData.online.toString()}</h3>
            </div>
          )}
        </section>
        <section className={styles["section"]}>
          <h2>Profile Settings</h2>
          <div className={styles["card"]}>
            <form className={styles["form"]} onSubmit={formUpdateUserSettings}>
              <label htmlFor="background-color-settings">
                Background Color Settings
              </label>
              <select
                name="background-color-settings"
                id="background-color-settings"
                defaultValue={
                  localStorage.getItem("backgroundColorSettings") || "main"
                }
              >
                <option value="">Light</option>
                <option value="dark">Dark</option>
              </select>
              <button type="submit">Apply Settings</button>
            </form>
          </div>
        </section>
      </>
    );
  }

  return <>Rendering Error</>;
}
