import styles from "./Home.module.css";

export default function Home() {
  return (
    <main
      className={
        styles[localStorage.getItem("backgroundColorSettings") || "main"]
      }
    >
      <section className={styles.section}>
        <h1>Welcome to the homepage!</h1>
        <article>
          <p>A messaging application</p>
        </article>
      </section>
    </main>
  );
}
