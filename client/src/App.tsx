import styles from "./App.module.css";
import { Outlet } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu";

function App() {
  return (
    <>
    <NavigationMenu />
      <Outlet />
    </>
  );
}

export default App;
