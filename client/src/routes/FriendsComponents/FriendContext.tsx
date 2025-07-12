/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";

export const FriendContext = createContext<{
    friendList: Array<any>;
    setFriendList: React.Dispatch<any>;
    refreshFriendList: number;
    setRefreshFriendList: React.Dispatch<any>;
    setFriendRequestCount: React.Dispatch<any>;
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