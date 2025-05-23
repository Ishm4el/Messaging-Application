const API_URL = import.meta.env.VITE_APP_API_URL;

export default function fetchPost({
  link,
  body,
}: {
  link: string;
  body: { [key: string]: any };
}) {
  const url = API_URL + link;
  return fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    method: "POST",
    body: JSON.stringify(body),
  });
}
