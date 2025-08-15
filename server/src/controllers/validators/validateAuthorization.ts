import { body } from "express-validator";

type username = { username: string };
type password = { password: string };
type email = { email: string };

type SignUpReqData = username & password & email;

const createUsernameChain = () =>
  body("username").trim().escape().isAlphanumeric().withMessage("username");

const createUsernameSignUpChain = () => 
  createUsernameChain().custom(async inputUsername => {
    
  })

const createEmailChain = () =>
  body("email").trim().escape().isEmail().withMessage("email");

const createPasswordChain = () =>
  body("password")
    .trim()
    .escape()
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    })
    .withMessage("password");

const signUpValidator = [
  createUsernameChain(),
  createEmailChain(),
  createPasswordChain(),
];

const validateLogin = [createUsernameChain(), createPasswordChain()];

export { signUpValidator, SignUpReqData, validateLogin };
