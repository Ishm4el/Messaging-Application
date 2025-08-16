import styles from "./SignUp.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { genericStyle, mainStyle, sectionStyle } from "../utility/cssDetermine";
import { Bounce, toast, ToastContainer, ToastOptions } from "react-toastify";
import {
  ValidPasswordProvider,
  ValidPasswordRequirements,
} from "../utility/ValidPasswordProvider";
import {
  checkValidPassword,
  useValidPasswordContext,
} from "../utility/ValidPasswordContext";

const notifySettings: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: `${genericStyle === "" ? "light" : "dark"}`,
  transition: Bounce,
};

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const { validPassword, password, setPassword } = useValidPasswordContext();

  const navigate = useNavigate();

  const formHandler: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const anyPasswordError = checkValidPassword({ validPassword });
    if (anyPasswordError) {
      const notfiy = () =>
        toast.error(
          `${anyPasswordError} requirement in password is not met`,
          notifySettings
        );
      notfiy();
      return;
    }

    const response = await fetch(
      "http://localhost:3000/authorization/sign_up",
      {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      }
    );

    const resJson = await response.json();

    console.log(resJson);

    if (resJson.status === 409) {
      const notfiy = () => toast.error(resJson.message, notifySettings);
      notfiy();
    }

    if (response.status === 200) {
      navigate("/");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

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
      <div>
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
        <ValidPasswordRequirements
          divClassName={styles[`password-requirements${genericStyle}`]}
          h5ClassName=""
          h6ClassNameLength={styles[validPassword.length ? "valid" : "invalid"]}
          h6ClassNameLowercase={
            styles[validPassword.lowercase ? "valid" : "invalid"]
          }
          h6ClassNameUppercase={
            styles[validPassword.uppercase ? "valid" : "invalid"]
          }
          h6ClassNameNumber={styles[validPassword.number ? "valid" : "invalid"]}
          h6ClassNameSpecial={
            styles[validPassword.special ? "valid" : "invalid"]
          }
        />
      </div>
      <button type="submit">Sign Up</button>
      <ToastContainer />
    </form>
  );
}

export default function SignUp() {
  return (
    <ValidPasswordProvider>
      <main className={styles[mainStyle]}>
        <section className={styles[sectionStyle]}>
          <h1>Sign Up Form</h1>
          <SignUpForm />
        </section>
      </main>
    </ValidPasswordProvider>
  );
}
