import App from "./App";
import type { RouteObject } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Home from "./routes/Home";
import SignUp from "./routes/SignUp";
import LogIn from "./routes/LogIn";
import Logout from "./routes/Logout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "sign_up", element: <SignUp /> },
      { path: "log_in", element: <LogIn /> },
      { path: "friends" },
      { path: "profile" },
      { path: "logout", element: <Logout /> },
    ],
  },
];

export default routes;
