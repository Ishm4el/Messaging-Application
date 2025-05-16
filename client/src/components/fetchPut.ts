export default function fetchPut({
  link,
  body,
}: {
  link: string;
  body: { [key: string]: any };
}) {
  return fetch(link, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    mode: "cors",
    method: "PUT",
    body: JSON.stringify(body),
  });
}
