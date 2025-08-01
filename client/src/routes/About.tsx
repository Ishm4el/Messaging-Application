import { mainStyle, sectionStyle } from "../utility/cssDetermine";
import styles from "./About.module.css";

export default function About() {
  return (
    <main className={styles[mainStyle]}>
      <section className={styles[sectionStyle]}>
        <h1>About</h1>
        <article>
          <h2>History</h2>
          <p className={styles.p}>
            Braid is a messaging application. It was concieved of from The Odin
            Project, as being the second to last programming projects from the
            NodeJS Section of the Full Stack Javascript Path
          </p>
        </article>
        <article className={styles.article}>
          <h2>Author</h2>
          <address className={styles.address}>
            <p className={styles.p}>
              Developed by: Ishm4el <br /> Github Repository:
              <a href="https://github.com/Ishm4el/Messaging-Application">
                here
              </a>
            </p>
          </address>
        </article>
      </section>
    </main>
  );
}
