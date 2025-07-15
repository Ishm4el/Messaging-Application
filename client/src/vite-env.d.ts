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

type OtherUserProfile =
  | ({
      friends: {
        username: string;
      }[];
      requests: {
        username: string;
      }[];
      requestsRelation: {
        username: string;
      }[];
    } & {
      username: string;
      online: boolean;
      createdAt: Date;
    })
  | null;

type Messages = Message[];

type Message = {
  author: {
    username: string;
  };
} & {
  id: string;
  createdAt: Date;
  text: string;
};

type MessageList = {
  username: string;
  loading: boolean;
  error: unknown;
  messages: Messages | null;
};

type MessageInput = {
  username: string;
  setMessages: React.Dispatch<React.SetStateAction<Messages | null>>;
};

type NewType = {
  list: {
    [key: string]: string;
  }[];
  search: string;
  filterOnProperty: string;
};