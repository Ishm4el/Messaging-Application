// import styles from "./App.module.css";
import { Outlet } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu";
import mainIcon from "/knot-svgrepo-com.svg";
import { useEffect, useState } from "react";
import { AuthorizedContext } from "./components/AuthorizedContext";

const addresses: { title: string; address: string }[] = [
  { title: "Home", address: "/" },
  { title: "Sign Up", address: "/sign_up" },
  { title: "Log In", address: "/log_in" },
];

const addressesUser: { title: string; address: string }[] = [
  { title: "Braid", address: "/friends" },
  { title: "Logout", address: "/logout" },
  { title: "About", address: "/" },
];

const websiteTitle: {
  title: string;
  svgLink: string;
  homeRoute: string;
} = { title: "Braid", homeRoute: "/", svgLink: mainIcon };

function App() {
  const [logged, setLogged] = useState<boolean>(
    localStorage.getItem("username") ? true : false
  );
  useEffect(() => {
    console.log("logged: " + logged);
  }, [logged]);

  return (
    <AuthorizedContext.Provider value={{ logged, setLogged }}>
      <NavigationMenu
        addresses={localStorage.username ? addressesUser : addresses}
        websiteTitle={websiteTitle}
      />
      <Outlet context={{ setLogged }} />
    </AuthorizedContext.Provider>
  );
}

export default App;
