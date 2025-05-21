import { useState, useEffect } from "react";
import { useFetchGet } from "../../components/useFetchGet";

export function CurrentUserProfile() {
  const { error, fetchedData, loading } = useFetchGet({
    link: "profile/primary_profile",
  });
  if (loading) return <>Loading!</>;
  if (error) return <>Error: {JSON.stringify(error)}</>;
  return <section>{JSON.stringify(fetchedData)}</section>;
}
