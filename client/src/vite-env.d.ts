/// <reference types="vite/client" />

type FriendList = {
  [key: string]: string;
}[];

type SetFriendList = React.Dispatch<React.SetStateAction<FriendList>>;

type SetRefreshFriendList = React.Dispatch<React.SetStateAction<number>>;

type SetFriendRequestCount = React.Dispatch<React.SetStateAction<number>>;

type setFilterFriendsOn = React.Dispatch<React.SetStateAction<string>>;
