import styles from "./SignUp.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { genericStyle, mainStyle, sectionStyle } from "../utility/cssDetermine";
import { Bounce, toast, ToastContainer, ToastOptions } from "react-toastify";

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
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    length: false,
  });
  const navigate = useNavigate();

  const formHandler: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    for (const e in validPassword) {
      if (validPassword[e] === false) {
        const notfiy = () =>
          toast.error(
            `${e} requirement in password is not met`,
            notifySettings
          );
        notfiy();
        return;
      }
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
    if (/[A-Z]/.test(password)) {
      setValidPassword((value) => {
        return { ...value, uppercase: true };
      });
    } else {
      setValidPassword((value) => {
        return { ...value, uppercase: false };
      });
    }
    if (/[a-z]/.test(password))
      setValidPassword((value) => {
        return { ...value, lowercase: true };
      });
    else
      setValidPassword((value) => {
        return { ...value, lowercase: false };
      });
    if (/[0-9]/.test(password))
      setValidPassword((value) => {
        return { ...value, number: true };
      });
    else
      setValidPassword((value) => {
        return { ...value, number: false };
      });
    if (/[#?!@$%^&*-]/.test(password))
      setValidPassword((value) => {
        return { ...value, special: true };
      });
    else
      setValidPassword((value) => {
        return { ...value, special: false };
      });
    if (/^.{6,}$/.test(password))
      setValidPassword((value) => {
        return { ...value, length: true };
      });
    else
      setValidPassword((value) => {
        return { ...value, length: false };
      });
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
        <div className={styles[`password-requirements${genericStyle}`]}>
          <h5>Password Requirements:</h5>
          <h6 className={styles[validPassword.length ? "valid" : "invalid"]}>
            * Must be atleast 6 characters length
          </h6>
          <h6 className={styles[validPassword.lowercase ? "valid" : "invalid"]}>
            * Must contain 1 lowercase letter
          </h6>
          <h6 className={styles[validPassword.uppercase ? "valid" : "invalid"]}>
            * Must contain 1 uppercase letter
          </h6>
          <h6 className={styles[validPassword.number ? "valid" : "invalid"]}>
            * Must contain 1 number
          </h6>
          <h6 className={styles[validPassword.special ? "valid" : "invalid"]}>
            * Must contain 1 special character
          </h6>
        </div>
      </div>
      <button type="submit">Sign Up</button>
      <ToastContainer />
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
