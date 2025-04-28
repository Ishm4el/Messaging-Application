import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  localStorage.clear();
  useEffect(() => {
    fetch("http://localhost:3000/authorization/logout", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((reason) => {
        console.log(reason);
      })
      .finally(() => navigate("/"));
  });
  return <></>;
}
