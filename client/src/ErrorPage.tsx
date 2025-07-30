import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import { genericStyle } from "./utility/cssDetermine";

export default function ErrorPage() {
  return (
    <main className={styles[`main-error${genericStyle}`]}>
      <section className={styles["section-error-response"]}>
        <h1>This route does not exist! Sorry!!</h1>
        <nav>
          <Link to={"/"}>CLICK HERE TO RETURN TO THE HOMEPAGE</Link>
        </nav>
      </section>
    </main>
  );
}
