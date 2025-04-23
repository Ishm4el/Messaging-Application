import App from "./App";
import type { RouteObject } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Home from "./routes/Home";
import SignUp from "./routes/SignUp";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "sign_up", element: <SignUp /> },
      { path: "friends" },
      { path: "profile" },
      { path: "sign_out" },
    ],
  },
];

export default routes;
