import { useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";

export default function Logout() {
  const outProps: { setLogged: React.Dispatch<React.SetStateAction<boolean>> } =
    useOutletContext();
  localStorage.clear();
  useEffect(() => {
    fetch("http://localhost:3000/authorization/logout", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((reason) => {
        console.log(reason);
      })
      .finally(() => {
        outProps.setLogged(false);
      });
  });
  return <Navigate to={"/"} />;
}
