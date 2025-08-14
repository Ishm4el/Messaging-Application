import styles from "./LogIn.module.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import { genericStyle, mainStyle, sectionStyle } from "../utility/cssDetermine";
import { Bounce, ToastContainer, toast } from "react-toastify";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const outProps: {
    setLogged: React.Dispatch<React.SetStateAction<boolean>>;
  } = useOutletContext();

  const notfiy = () =>
    toast.error("Failed to log in", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: `${genericStyle === "" ? "light" : "dark"}`,
      transition: Bounce,
    });

  const formHandlerLogin = async (event) => {
    event.preventDefault();
    // alert(email + " " + password);
    const response = await fetch("http://localhost:3000/authorization/log_in", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    const status = response.status;
    const res = await response.json();
    console.log("finished the login!");

    console.log(response);
    console.log(res);

    if (status === 401) {
      // if (res.message === "username") alert("No matching username");
      // if (res.message === "password") alert("Incorrect password");
      notfiy();
    }

    if (status === 200) {
      localStorage.setItem("username", res.username);
      localStorage.setItem(
        "backgroundColorSettings",
        res.settings.backgroundColorSettings
      );
      outProps.setLogged(true);
      navigate("/friends");
    }
  };

  return (
    <main className={styles[mainStyle]}>
      <section className={styles[sectionStyle]}>
        <h1 className={styles["header"]}>Logging In</h1>
        <form
          className={styles[`form${genericStyle}`]}
          onSubmit={formHandlerLogin}
        >
          <div className={styles[`input-container${genericStyle}`]}>
            <label htmlFor="username">Username:</label>
            <input
              type="username"
              name="username"
              id="username"
              placeholder="Username"
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className={styles[`input-container${genericStyle}`]}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit">Log In</button>
        </form>
      </section>
      <ToastContainer />
    </main>
  );
}
