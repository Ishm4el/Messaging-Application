// import styles from "./App.module.css";
import { Outlet } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu";
import mainIcon from "/knot-svgrepo-com.svg";
import { useEffect, useState } from "react";

const addresses: { title: string; address: string }[] = [
  { title: "Home", address: "/" },
  { title: "Sign Up", address: "/sign_up" },
  { title: "Log In", address: "/log_in" },
  { title: "Test", address: "/test" },
];

const addressesUser: { title: string; address: string }[] = [
  { title: "Home", address: "/" },
  { title: "Braid", address: "/braid" },
  { title: "Friends", address: "/friends" },
  { title: "Profile", address: "/profile" },
  { title: "Logout", address: "/logout" },
  { title: "Test", address: "/test" },
];

const websiteTitle: {
  title: string;
  svgLink: string;
  homeRoute: string;
} = { title: "Braid", homeRoute: "/", svgLink: mainIcon };

function App() {
  const [logged, setLogged] = useState(
    localStorage.getItem("username") ? true : false
  );
  useEffect(() => {
    console.log("logged: " + logged);
  }, [logged]);

  return (
    <>
      <NavigationMenu
        addresses={localStorage.username ? addressesUser : addresses}
        websiteTitle={websiteTitle}
      />
      <Outlet context={{ setLogged }} />
    </>
  );
}

export default App;
