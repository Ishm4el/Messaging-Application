import { createContext, useContext } from "react";

export const FriendContext = createContext<{
  friendList: FriendList;
  setFriendList: SetFriendList;
  refreshFriendList: number;
  setRefreshFriendList: SetRefreshFriendList;
  setFriendRequestCount: SetFriendRequestCount;
} | null>(null);

export function useFriendContext() {
  const friendContext = useContext(FriendContext);
  if (!friendContext) {
    throw new Error(
      "useFriendContext has to be used within <FriendContext.Provider>!"
    );
  }
  return friendContext;
}
