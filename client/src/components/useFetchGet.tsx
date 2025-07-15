import { useEffect, useState } from "react";
import fetchGet from "./fetchGet";

interface UseFetchInternalArguments {
  link: string;
  dependecy?: Array<unknown>;
}

interface UseFetchExternalArguments<T> extends UseFetchInternalArguments {
  setFetchedData: React.Dispatch<React.SetStateAction<T>>;
}

interface UseFetchExternal {
  loading: boolean;
  error: object | null;
}

interface UseFetchInternal<T> extends UseFetchExternal {
  fetchedData: T | null;
  setFetchedData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function useFetchGetExternal<T>({
  link,
  dependecy = [null],
  setFetchedData,
}: UseFetchExternalArguments<T>): UseFetchExternal {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<object | null>(null);
  useEffect(() => {
    fetchGet(link)
      .then((res) => {
        console.log(res);

        if (res.status !== 200)
          return Promise.reject({ error: "Currently not signed in" });
        return res.json();
      })
      .then((resJson) => {
        console.log("printing resJson");
        console.log(resJson);

        setFetchedData(resJson);
      })
      .catch((err) => {
        console.log("An error was found!");
        console.log(err);
        setError(err);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependecy]);
  return { error, loading };
}

export function useFetchGetInternal<T>({
  link,
  dependecy = [null],
}: UseFetchInternalArguments): UseFetchInternal<T> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<object | null>(null);
  const [fetchedData, setFetchedData] = useState<T | null>(null);
  useEffect(() => {
    fetchGet(link)
      .then((res) => res.json())
      .then((resJson) => setFetchedData(resJson))
      .catch((err: object) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependecy]);
  return { loading, error, fetchedData, setFetchedData };
}
