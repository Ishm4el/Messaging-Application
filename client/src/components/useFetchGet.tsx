import { useEffect, useState } from "react";
import fetchGet from "./fetchGet";

interface UseFetchInternalArguments {
  link: string;
  dependecy?: Array<unknown>;
}

interface UseFetchExternalArguments extends UseFetchInternalArguments {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFetchedData: React.Dispatch<React.SetStateAction<any>>;
}

interface UseFetchExternal {
  loading: boolean;
  error: unknown;
}

interface UseFetchInternal extends UseFetchExternal {
  fetchedData: { [key: string]: unknown } | null;
  setFetchedData: React.Dispatch<
    React.SetStateAction<{
      [key: string]: unknown;
    }>
  >;
}

export function useFetchGetExternal({
  link,
  dependecy = [null],
  setFetchedData,
}: UseFetchExternalArguments): UseFetchExternal {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
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

export function useFetchGetInternal({
  link,
  dependecy = [null],
}: UseFetchInternalArguments): UseFetchInternal {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [fetchedData, setFetchedData] = useState<{ [key: string]: unknown }>(
    {}
  );
  useEffect(() => {
    fetchGet(link)
      .then((res) => res.json())
      .then((resJson) => setFetchedData(resJson))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependecy]);
  return { loading, error, fetchedData, setFetchedData };
}
