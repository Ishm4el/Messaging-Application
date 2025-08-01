import { Link } from "react-router-dom";
import { cardStyle, mainStyle, sectionStyle } from "../utility/cssDetermine";
import styles from "./Unauthorized.module.css";
export default function Unauthorized() {
  return (
    <main className={styles[mainStyle]}>
      <section className={styles[sectionStyle]}>
        <div className={styles[cardStyle]}>
          <h1>Sorry, you are unauthrozied</h1>
          <h3>Please try signing in</h3>
          <Link to={"/log_in"} className={styles.link}>Log In</Link>
        </div>
      </section>
    </main>
  );
}
