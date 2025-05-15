import { useEffect, useState } from "react";

export default function useFecthGet({
  link,
  dependecy = [null],
}: {
  link: string;
  dependecy?: Array<any>;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [fetchedData, setFetchedData] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    fetch(link, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((resJson) => setFetchedData(resJson))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [...dependecy]);
  return { loading, error, fetchedData };
}
