import styles from "./App.module.css";
import { Outlet } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu";

const addresses: { title: string; address: string }[] = [
  { title: "Home", address: "/" },
  { title: "Sign Up", address: "/sign_up" },
  { title: "Log In", address: "/log_in" },
];

const addressesUser: { title: string; address: string }[] = [
  { title: "braid", address: "/braid" },
  { title: "Friends", address: "/friends" },
  { title: "Profile", address: "/profile" },
  { title: "Sign Out", address: "/sign_out" },
];

const websiteTitle: {
  title: string;
  svgLink: string;
  homeRoute: string;
} = { title: "Braid", homeRoute: "/", svgLink: "" };

function App() {
  return (
    <>
      <NavigationMenu addresses={addresses} websiteTitle={websiteTitle} />
      <Outlet />
    </>
  );
}

export default App;
