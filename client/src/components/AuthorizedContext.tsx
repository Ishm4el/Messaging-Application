import { createContext, useContext } from "react";

export const AuthorizedContext = createContext<{
  logged: boolean;
  setLogged: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function useAuthorizedContext() {
  const authorizedContext = useContext(AuthorizedContext);
  if (!authorizedContext) {
    throw new Error(
      "useAuthorizedContext has to be used within <AuthorizedContext.Provider>!"
    );
  }
  return authorizedContext;
}
