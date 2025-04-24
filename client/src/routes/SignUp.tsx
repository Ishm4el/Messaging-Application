import styles from "./SignUp.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <main className={styles["main"]}>
      <h1>Sign Up Form</h1>
      <form
        className={styles["form"]}
        onSubmit={async (event) => {
          event.preventDefault();
          // alert(email + " " + username + " " + password);
          const response = await fetch(
            "http://localhost:3000/authorization/sign_up",
            {
              method: "POST",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password, email }),
            }
          );

          // const res = await response.json();
          if (response.status === 200) {
            navigate("/");
          }
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="userEmail"
          name="userEmail"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
    </main>
  );
}
