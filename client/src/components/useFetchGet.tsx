import { useEffect, useState } from "react";
import fetchGet from "./fetchGet";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  useEffect(() => {
    fetchGet(link)
      .then((res) => {
        const json = res.json();
        if (res.status !== 200) return json.then(Promise.reject.bind(Promise));
        return json;
      })
      .then((resJson) => {
        console.log("printing resJson");
        console.log(resJson);
        setFetchedData(resJson);
      })
      .catch((err) => {
        if (
          err.status === 403 &&
          err.message === "User must be signed in to access this route"
        ) {
          localStorage.removeItem("username");
          navigate("/unauthorized");
        }
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
