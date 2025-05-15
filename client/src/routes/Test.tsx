import { useEffect, useState } from "react";

export default function Test() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    // fetch("http://localhost:3000/authorization/protected", {
    fetch("http://localhost:3000/authorization/protected", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        setMsg(JSON.stringify(res));
      });
  });
  if (msg) {
    return (
      <>
        <span>{msg}</span>
      </>
    );
  }
  return (
    <>
      <span>loading!</span>
    </>
  );
}
