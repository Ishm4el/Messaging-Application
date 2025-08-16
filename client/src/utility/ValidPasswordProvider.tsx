import { useEffect, useState } from "react";
import { ValidPasswordContext } from "./ValidPasswordContext";

type SetValidPassword = React.Dispatch<
  React.SetStateAction<{
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
    length: boolean;
  }>
>;

export function checkIfValidPassword({
  password,
  setValidPassword,
}: {
  password: string;
  setValidPassword: SetValidPassword;
}) {
  if (/[A-Z]/.test(password)) {
    setValidPassword((value) => {
      return { ...value, uppercase: true };
    });
  } else {
    setValidPassword((value) => {
      return { ...value, uppercase: false };
    });
  }
  if (/[a-z]/.test(password))
    setValidPassword((value) => {
      return { ...value, lowercase: true };
    });
  else
    setValidPassword((value) => {
      return { ...value, lowercase: false };
    });
  if (/[0-9]/.test(password))
    setValidPassword((value) => {
      return { ...value, number: true };
    });
  else
    setValidPassword((value) => {
      return { ...value, number: false };
    });
  if (/[#?!@$%^&*-]/.test(password))
    setValidPassword((value) => {
      return { ...value, special: true };
    });
  else
    setValidPassword((value) => {
      return { ...value, special: false };
    });
  if (/^.{6,}$/.test(password))
    setValidPassword((value) => {
      return { ...value, length: true };
    });
  else
    setValidPassword((value) => {
      return { ...value, length: false };
    });
}

export function ValidPasswordRequirements({
  divClassName = "",
  h5ClassName = "",
  h6ClassNameLength = "",
  h6ClassNameLowercase = "",
  h6ClassNameUppercase = "",
  h6ClassNameNumber = "",
  h6ClassNameSpecial = "",
}: {
  divClassName: string;
  h5ClassName: string;
  h6ClassNameLength: string;
  h6ClassNameLowercase: string;
  h6ClassNameUppercase: string;
  h6ClassNameNumber: string;
  h6ClassNameSpecial: string;
}) {
  return (
    <div className={divClassName}>
      <h5 className={h5ClassName}>Password Requirements:</h5>
      <h6 className={h6ClassNameLength}>
        * Must be atleast 6 characters length
      </h6>
      <h6 className={h6ClassNameLowercase}>
        * Must contain 1 lowercase letter
      </h6>
      <h6 className={h6ClassNameUppercase}>
        * Must contain 1 uppercase letter
      </h6>
      <h6 className={h6ClassNameNumber}>* Must contain 1 number</h6>
      <h6 className={h6ClassNameSpecial}>* Must contain 1 special character</h6>
    </div>
  );
}

export function ValidPasswordProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    length: false,
  });

  useEffect(() => {
    checkIfValidPassword({ password, setValidPassword });
  }, [password]);

  return (
    <ValidPasswordContext.Provider
      value={{ password, setPassword, setValidPassword, validPassword }}
    >
      {children}
    </ValidPasswordContext.Provider>
  );
}
