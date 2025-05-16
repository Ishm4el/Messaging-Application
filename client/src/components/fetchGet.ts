export default function fetchGet(link: string) {
  return fetch(link, {
    method: "GET",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}
