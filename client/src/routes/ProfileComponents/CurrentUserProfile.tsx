import styles from "./Profile.module.css";
import { UseFetchGetInternal } from "../../components/useFetchGet";
import { Link, useNavigate } from "react-router-dom";
import fetchPost from "../../components/fetchPost";
import {
  cardStyle,
  genericStyle,
  sectionStyle,
} from "../../utility/cssDetermine";

function BioProfile({ fetchedData }) {
  return (
    <section className={styles[sectionStyle]}>
      <h2 className={styles["section-title"]}>Personal Profile</h2>
      {fetchedData !== null && (
        <div className={styles[cardStyle]}>
          <h3 className={styles["cool"]}>Username: {fetchedData.username}</h3>
          <h3>Created: {fetchedData.createdAt.toString()}</h3>
          <h3>Online: {fetchedData.online.toString()}</h3>
        </div>
      )}
    </section>
  );
}

function SettingsProfile() {
  const navigate = useNavigate();
  const formUpdateUserSettings = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const formData = new FormData(ev.currentTarget);
    console.log(formData.get("background-color-settings"));
    console.log("fetchPosting");

    fetchPost({
      link: "profile/settings",
      body: {
        backgroundColorSettings: formData.get("background-color-settings"),
      },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem(
          "backgroundColorSettings",
          res.backgroundColorSettings
        );
        navigate(0);
      })
      .catch((reason) => {
        console.log(reason);
        console.log("in Reason ");
      });
  };

  return (
    <section className={styles[sectionStyle]}>
      <h2>Profile Settings</h2>
      <div className={styles[cardStyle]}>
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
          <br />
          <button type="submit">Apply Settings</button>
        </form>
      </div>
    </section>
  );
}

export function CurrentUserProfile() {
  const { error, fetchedData, loading } = UseFetchGetInternal<{
    username: string;
    online: boolean;
    createdAt: Date;
  } | null>({
    link: "profile/primary_profile",
  });

  if (loading) return <>Loading!</>;

  if (error !== null) {
    localStorage.removeItem("username");
    return (
      <article>
        <h1>{error.name}</h1>
        <h2>
          {error.message}; it is possible that the cookie has expired - please
          try signing in again.
        </h2>
        <Link to={"/log_in"}>Click here to go to the sign in page.</Link>
      </article>
    );
  }

  if (fetchedData) {
    return (
      <article className={styles[`article${genericStyle}`]}>
        <BioProfile fetchedData={fetchedData} />
        <SettingsProfile />
      </article>
    );
  }

  return <>Rendering Error</>;
}
