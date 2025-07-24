import App from "./App";
import type { RouteObject } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import About from "./routes/About";
import SignUp from "./routes/SignUp";
import LogIn from "./routes/LogIn";
import Logout from "./routes/Logout";
import Friends from "./routes/Friends";
import Test from "./routes/Test";
import Profile from "./routes/Profile";
import Message from "./routes/Message";
import Unauthorized from "./routes/Unauthorized";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <About /> },
      { path: "sign_up", element: <SignUp /> },
      { path: "log_in", element: <LogIn /> },
      { path: "friends", element: <Friends /> },
      { path: "logout", element: <Logout /> },
      { path: "test", element: <Test /> },
      { path: "profile/:username", element: <Profile /> },
      { path: "message/:username", element: <Message /> },
      { path: "unauthorized", element: <Unauthorized /> },
    ],
  },
];

export default routes;
