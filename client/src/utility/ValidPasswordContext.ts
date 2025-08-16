import { createContext, useContext } from "react";

type SetValidPassword = React.Dispatch<
  React.SetStateAction<{
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    length: boolean;
  }>
>;

type SetPassword = React.Dispatch<React.SetStateAction<string>>;

interface ValidPassword {
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  length: boolean;
}

export const ValidPasswordContext = createContext<{
  validPassword: ValidPassword;
  setValidPassword: SetValidPassword;
  password: string;
  setPassword: SetPassword;
} | null>(null);

export function useValidPasswordContext() {
  const validPasswordContext = useContext(ValidPasswordContext);
  if (!validPasswordContext) {
    throw new Error(
      "useValidPasswordContext has to be used within <ValidPassword.Provider>!"
    );
  }
  return validPasswordContext;
}

export function isPasswordValid({
  validPassword,
}: {
  validPassword: ValidPassword;
}) {
  for (const e in validPassword) {
    if (validPassword[e] === false) {
      return false;
    }
  }
  return true;
}

export function checkValidPassword({
  validPassword,
}: {
  validPassword: ValidPassword;
}) {
  for (const e in validPassword) {
    if (validPassword[e] === false) {
      return e;
    }
  }
  return null;
}
