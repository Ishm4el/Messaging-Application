import styles from "./Home.module.css";

export default function Home() {
  return (
    <main className={styles["container-main"]}>
      <header className={styles["container-header"]}>
        <h1>Welcome to the homepage!</h1>
      </header>
    </main>
  );
}
