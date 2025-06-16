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

if (mode === "null") {
  scan({
    enabled: true,
  });
}

const updateAppPrompt = (e) => {
  if (e.data?.type === "NEW_VERSION_AVAILABLE") {
    // Notify user in-app (custom logic/UI here)
    const shouldRefresh = confirm(
      "A new version of this app is available. Reload now?"
    );
    if (shouldRefresh) {
      window.location.reload();
    }
  }
};

const loadServiceWorker = async () => {
  const registration = await navigator.serviceWorker.register("/sw.js");
  console.log("Service Worker registered with scope:", registration.scope);

  navigator.serviceWorker.addEventListener("message", updateAppPrompt);

  if ("periodicSync" in registration) {
    try {
      await registration.periodicSync?.register("periodic-sync-example", {
        minInterval: 24 * 60 * 60 * 1000, // once per day
      });
    } catch (err) {
      console.error("Periodic Sync not supported or permission denied: ", err);
    }
  }

  if ("sync" in registration) {
    try {
      registration.sync?.register("sync-tag-example");
    } catch (err) {
      console.log("Background Sync not supported or permission denied: ", err);
    }
  }

  if ("Notification" in window && Notification.permission !== "granted") {
    try {
      const notificationPermission = await Notification.requestPermission();
      console.log(notificationPermission);
    } catch (err) {
      console.log("Permissions unaccessible. Error: ", err);
    }
  }
};

// Checking for null because no service worker should run in prod or dev for now
if ("serviceWorker" in navigator && mode === "null") {
  // Register service worker for "/"
  window.addEventListener("load", loadServiceWorker);
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
