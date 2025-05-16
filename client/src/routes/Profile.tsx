import { useParams } from "react-router-dom";
import { useFetchGet } from "../components/useFetchGet";

export default function Profile() {
  const { username } = useParams();
  const { error, loading, fetchedData } = useFetchGet({
    link: `http://localhost:3000/profile/:${username}`,
  });
  if (loading) return <span>loading</span>;
  if (error) return <span>error!</span>;
  return <main>{JSON.stringify(fetchedData)}</main>;
}
