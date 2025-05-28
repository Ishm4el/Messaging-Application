import App from "./App";
import type { RouteObject } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Home from "./routes/Home";
import SignUp from "./routes/SignUp";
import LogIn from "./routes/LogIn";
import Logout from "./routes/Logout";
import Friends from "./routes/Friends";
import Test from "./routes/Test";
import Profile from "./routes/Profile";
import Braid from "./routes/Braid";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "sign_up", element: <SignUp /> },
      { path: "log_in", element: <LogIn /> },
      { path: "friends", element: <Friends /> },
      { path: "profile" },
      { path: "logout", element: <Logout /> },
      { path: "test", element: <Test /> },
      { path: "profile/:username", element: <Profile /> },
      { path: "braid", element: <Braid /> },
    ],
  },
];

export default routes;
