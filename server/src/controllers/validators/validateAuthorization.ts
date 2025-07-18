import { body } from "express-validator";

type username = { username: string };
type password = { password: string };
type email = { email: string };

type SignUpReqData = username & password & email;

const createUsernameChain = () =>
  body("username").trim().escape().isAlphanumeric();
const createEmailChain = () => body("email").trim().escape().isEmail();

const createPasswordChain = () =>
  body("password").trim().escape().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  });

const signUpValidator = [
  createUsernameChain(),
  createEmailChain(),
  createPasswordChain(),
];

const validateLogin = [createPasswordChain(), createUsernameChain()];

export { signUpValidator, SignUpReqData, validateLogin };
