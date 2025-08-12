import styles from "./SignUp.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { genericStyle, mainStyle, sectionStyle } from "../utility/cssDetermine";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const formHandler: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    const response = await fetch(
      "http://localhost:3000/authorization/sign_up",
      {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      }
    );

    if (response.status === 200) {
      navigate("/");
    }
  };

  return (
    <form className={styles[`form${genericStyle}`]} onSubmit={formHandler}>
      <div className={styles[`input-container${genericStyle}`]}>
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="userEmail"
          name="userEmail"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <div className={styles[`input-container${genericStyle}`]}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>
      <div className={styles[`input-container${genericStyle}`]}>
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default function SignUp() {
  return (
    <main className={styles[mainStyle]}>
      <section className={styles[sectionStyle]}>
        <h1>Sign Up Form</h1>
        <SignUpForm />
      </section>
    </main>
  );
}
