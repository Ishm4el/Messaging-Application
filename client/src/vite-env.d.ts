/// <reference types="vite/client" />

type FriendList = {
  [key: string]: string;
}[];

type SetFriendList = React.Dispatch<React.SetStateAction<FriendList>>;

type SetRefreshFriendList = React.Dispatch<React.SetStateAction<number>>;

type SetFriendRequestCount = React.Dispatch<React.SetStateAction<number>>;

type setFilterFriendsOn = React.Dispatch<React.SetStateAction<string>>;

interface Found {
  username: string;
  requests: { username?: string }[];
  friends: { username?: string }[];
  requestsRelation: { username?: string }[];
}

type SetFound = React.Dispatch<React.SetStateAction<FoundArray>>;

type FoundArray = Array<Found>;

type SetInitialSearch = React.Dispatch<React.SetStateAction<boolean>>;

type SetSeekingUser = React.Dispatch<React.SetStateAction<string>>;
