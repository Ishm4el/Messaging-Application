import styles from "./App.module.css";
import { Outlet } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu";

const addresses: { title: string; address: string }[] = [
  { title: "Home", address: "/home" },
  { title: "Profile", address: "/profile" },
];

const websiteTitle: {
  title: string;
  svgLink: string;
  homeRoute: string;
} = { title: "Braid", homeRoute: "/home", svgLink: "" };

function App() {
  return (
    <>
      <NavigationMenu addresses={addresses} websiteTitle={websiteTitle} />
      <Outlet />
    </>
  );
}

export default App;
