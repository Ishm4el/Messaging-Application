import { useFetchGet } from "../../components/useFetchGet";

export function OtherUserProfile({ username }: { username: string }) {
  const { error, loading, fetchedData } = useFetchGet({
    link: `profile/other_profile/${username}`,
  });
  if (loading) return <span>loading</span>;
  if (error) return <span>error!</span>;
  return <section>{JSON.stringify(fetchedData)}</section>;
}
