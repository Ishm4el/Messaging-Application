import { useEffect, useState } from "react";
import fetchGet from "./fetchGet";
import { useNavigate } from "react-router-dom";
import { useAuthorizedContext } from "./AuthorizedContext";

interface UseFetchInternalArguments {
  link: string;
  dependecy?: Array<unknown>;
}

interface UseFetchExternalArguments<T> extends UseFetchInternalArguments {
  setFetchedData: React.Dispatch<React.SetStateAction<T>>;
}

interface UseFetchExternal {
  loading: boolean;
  error: FetchError | null;
}

interface UseFetchInternal<T> extends UseFetchExternal {
  fetchedData: T | null;
  setFetchedData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function UseFetchGetExternal<T>({
  link,
  dependecy = [null],
  setFetchedData,
}: UseFetchExternalArguments<T>): UseFetchExternal {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FetchError | null>(null);
  const navigate = useNavigate();
  const { setLogged } = useAuthorizedContext();
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
      .catch((err: FetchError) => {
        if (
          err.status === 403 &&
          err.message === "User must be signed in to access this route"
        ) {
          localStorage.removeItem("username");
          setLogged(false);
          navigate("/unauthorized");
        }
        setError(err);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependecy]);
  return { error, loading };
}

export function UseFetchGetInternal<T>({
  link,
  dependecy = [null],
}: UseFetchInternalArguments): UseFetchInternal<T> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FetchError | null>(null);
  const [fetchedData, setFetchedData] = useState<T | null>(null);
  useEffect(() => {
    fetchGet(link)
      .then((res) => res.json())
      .then((resJson) => {
        if (
          resJson.status === 403 &&
          resJson.message === "User must be signed in to access this route"
        ) {
          throw resJson;
        } else setFetchedData(resJson);
      })
      .catch((err: FetchError) => setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependecy]);
  return { loading, error, fetchedData, setFetchedData };
}
