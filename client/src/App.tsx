import styles from "./App.module.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <p className={styles["p-test"]}>Hello world!</p>
      <Outlet />
    </>
  );
}

export default App;
