import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App.tsx";
import { NotifProvider } from "./context/notifCtxt.tsx";
import { UserProvider } from "./context/userCtxt.tsx";

// if ("serviceWorker" in navigator) {
//   // Register service worker for "/"
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then((registration) => {
//         console.log(
//           "Service Worker registered with scope:",
//           registration.scope
//         );
//       })
//       .catch((error) => {
//         console.error("Service Worker registration failed:", error);
//       });
//   });
// }

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <NotifProvider>
          <App />
        </NotifProvider>
      </UserProvider>
    </Router>
  </React.StrictMode>
);
