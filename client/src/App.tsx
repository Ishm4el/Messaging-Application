import styles from "./App.module.css";
import { Outlet } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu";
import mainIcon from "/knot-svgrepo-com.svg";

const addresses: { title: string; address: string }[] = [
  { title: "Home", address: "/" },
  { title: "Sign Up", address: "/sign_up" },
  { title: "Log In", address: "/log_in" },
];

const addressesUser: { title: string; address: string }[] = [
  { title: "Home", address: "/" },
  { title: "Braid", address: "/braid" },
  { title: "Friends", address: "/friends" },
  { title: "Profile", address: "/profile" },
  { title: "Logout", address: "/logout" },
];

const websiteTitle: {
  title: string;  
  svgLink: string;
  homeRoute: string;
} = { title: "Braid", homeRoute: "/", svgLink: mainIcon };

function App() {
  return (
    <>
      <NavigationMenu
        addresses={localStorage.username ? addressesUser : addresses}
        websiteTitle={websiteTitle}
      />
      <Outlet />
    </>
  );
}

export default App;
