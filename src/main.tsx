/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { scan } from "react-scan";

import App from "./App.tsx";
import { ConfigProvider } from "./context/configContext.tsx";
import { DatabaseProvider } from "./context/dbContext.tsx";
import { NotifProvider } from "./context/notifCtxt.tsx";
import { UserProvider } from "./context/userCtxt.tsx";

const mode = import.meta.env.VITE_APP_MODE || "prod";

if (mode === "dev") {
  scan({
    enabled: true,
  });
}

// Checking for null because no service worker should run in prod or dev for now
if ("serviceWorker" in navigator && mode === "null") {
  // Register service worker for "/"
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  // React.Fragment used to stop import from being erased and typescript errors to stay in check
  <React.Fragment>
    <Router>
      <DatabaseProvider>
        <ConfigProvider>
          <UserProvider>
            <NotifProvider>
              <App />
            </NotifProvider>
          </UserProvider>
        </ConfigProvider>
      </DatabaseProvider>
    </Router>
  </React.Fragment>
  // </React.StrictMode>
);
