import styles from "./LogIn.module.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const outProps: {
    setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  } = useOutletContext();
  return (
    <main className={styles["main"]}>
      <h1 className={styles["header"]}>Logging In</h1>
      <form
        className={styles["form"]}
        onSubmit={async (event) => {
          event.preventDefault();
          // alert(email + " " + password);
          const response = await fetch(
            "http://localhost:3000/authorization/log_in",
            {
              method: "POST",
              mode: "cors",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password }),
              credentials: "include",
            }
          );
          const status = response.status;
          const res = await response.json();
          console.log("finished the login!");

          console.log(response);
          console.log(res);

          if (status === 401) {
            if (res.message === "username") alert("No matching username");
            if (res.message === "password") alert("Incorrect password");
          }

          if (status === 200) {
            localStorage.setItem("username", res.username);
            localStorage.setItem(
              "backgroundColor",
              res.settings.backgroundColorSettings || "main"
            );
            outProps.setLogged(true);
            navigate("/");
          }
        }}
      >
        <label htmlFor="username">Username</label>
        <input
          type="username"
          name="username"
          id="username"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
    </main>
  );
}
