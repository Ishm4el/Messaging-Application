import styles from "./LogIn.module.css";
import { useState } from "react";
export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <main className={styles["main"]}>
      <h1 className={styles["header"]}>Logging In</h1>
      <form
        className={styles["form"]}
        onSubmit={(event) => {
          event.preventDefault();
          alert(email + " " + password);
        }}
      >
        <label htmlFor="email">email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </main>
  );
}
