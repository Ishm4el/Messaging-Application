import { useEffect, useState } from "react";
import fetchGet from "./fetchGet";

interface LinkDep {
  link: string;
  dependecy?: Array<any>;
}

interface UseFetchInternal {
  loading: boolean;
  error: string;
  fetchedData: { [key: string]: any } | null;
  setFetchedData: React.Dispatch<any>;
}

interface UseFetchExternal {
  loading: boolean;
  error: string;
}

export function useFetchGet(
  linkDep: LinkDep,
  setFetchedData: React.Dispatch<any>
): UseFetchExternal;

export function useFetchGet(linkDep: LinkDep): UseFetchInternal;

export function useFetchGet(
  linkDep: LinkDep,
  setFetchedData?: React.Dispatch<any>
) {
  if (typeof setFetchedData !== "undefined") {
    return useFetchGetExternal(linkDep, setFetchedData);
  }
  return useFetchGetInternal(linkDep);
}

function useFetchGetExternal(
  { link, dependecy = [null] }: LinkDep,
  setFetchedData: React.Dispatch<any>
): UseFetchExternal {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
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
  }, [...dependecy]);
  return { error, loading };
}

function useFetchGetInternal({
  link,
  dependecy = [null],
}: LinkDep): UseFetchInternal {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [fetchedData, setFetchedData] = useState<{ [key: string]: any }>({});
  useEffect(() => {
    fetchGet(link)
      .then((res) => res.json())
      .then((resJson) => setFetchedData(resJson))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [...dependecy]);
  return { loading, error, fetchedData, setFetchedData };
}
