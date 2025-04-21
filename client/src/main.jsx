import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Tutor from "./components/Tutor";
import TutorList from "./components/TutorList";
import StudentList from "./components/StudentList";
import Student from "./components/Student";
import SessionList from "./components/SessionList";
import Session from "./components/Session";
import MemberList from "./components/MemberList"; // Import the MemberList component

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <>
            <StudentList />
            <TutorList />
            <SessionList />
            <MemberList /> {/* Display the MemberList component here */}
          </>
        ),
      },
    ],
  },
  {
    path: "/edit-student/:id",
    element: <App />,
    children: [
      {
        path: "/edit-student/:id",
        element: <Student />,
      },
    ],
  },
  {
    path: "/edit-tutor/:id",
    element: <App />,
    children: [
      {
        path: "/edit-tutor/:id",
        element: <Tutor />,
      },
    ],
  },
  {
    path: "/edit-session/:id",
    element: <App />,
    children: [
      {
        path: "/edit-session/:id",
        element: <Session />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <Student />,
      },
    ],
  },
  {
    path: "/create-tutor",
    element: <App />,
    children: [
      {
        path: "/create-tutor",
        element: <Tutor />,
      },
    ],
  },
  {
    path: "/create-session",
    element: <App />,
    children: [
      {
        path: "/create-session",
        element: <Session />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
