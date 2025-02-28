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

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { TiMessages } from "react-icons/ti";
import { Navigate, Route, Routes } from "react-router-dom";

import ChatsMenu from "./components/ChatsMenu.tsx";
import Messages from "./components/Messages.tsx";
import Nav from "./components/Nav.tsx";
import ProfileNav from "./components/ProfileNav.tsx";
import SysNotif from "./components/SysNotif.tsx";
import { InteractiveProvider } from "./context/interactiveCtxt.tsx";
import { SocketProvider } from "./context/socketCtxt.tsx";
import useUserData from "./hooks/useUserData.ts";
import Help from "./states/Help.tsx";
import Home from "./states/Home.tsx";
import Login from "./states/Login.tsx";
import NewContact from "./states/NewContact.tsx";
import Profile from "./states/Profile.tsx";
import SignUp from "./states/SignUp.tsx";
import UserMenu from "./states/UserMenu.tsx";
import Verify from "./states/Verify.tsx";

const MainLoad = () => {
  // Initial loading component for native app-like feel
  return (
    <motion.section
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="z-[999] flex justify-center items-center fixed inset-0 bg-[#000]"
    >
      <motion.p
        initial={{ rotateZ: -360, scale: 0 }}
        animate={{
          rotateZ: 0,
          scale: 1,
          transition: { delay: 0.25, duration: 0.75, type: "spring" },
        }}
        className="text-9xl text-primary"
      >
        <TiMessages />
      </motion.p>
    </motion.section>
  );
};

const App = () => {
  const [authToken] = useUserData("authToken");

  const mainLoad = useRef(true);

  useEffect(() => {
    let timeoutId = setTimeout(() => {});

    if (!mainLoad.current) {
      return;
    }

    // No existing user, allow default load component time 1s 250ms
    if (authToken) {
      timeoutId = setTimeout(() => {
        mainLoad.current = false;
      }, 1250);
    }

    if (!authToken) {
      mainLoad.current = false;
      clearTimeout(timeoutId);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [authToken]);

  return (
    <main>
      <SysNotif />
      {/* Loading component --local */}
      <AnimatePresence>
        {mainLoad.current ? <MainLoad /> : null}
      </AnimatePresence>
      {/* Loading component --local */}
      <InteractiveProvider>
        {authToken ? <ProfileNav /> : <Nav />}
        <Routes>
          {authToken ? (
            <Route path="/" element={<Navigate to="/profile" />} />
          ) : (
            <Route path="/" element={<Home />} />
          )}

          {/* All memoized routes to not suffer recalculation on authToken changes */}
          <Route path="/login/:type" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify/:type/:method" element={<Verify />} />
          <Route path="/help" element={<Help />} />
          {/* All memoized routes to not suffer recalculation on authToken changes */}

          <Route
            path="/profile"
            element={
              authToken ? (
                <SocketProvider>
                  <Profile />
                </SocketProvider>
              ) : (
                <Navigate to="/" />
              )
            }
          >
            {/* Nested routes for "/profile" */}
            <Route path="newcontact" element={<NewContact />} />
            <Route path="account" element={<UserMenu />} />
            <Route path="messages" element={<ChatsMenu />} />
            <Route path="contacts" element={<Messages />} />
            {/* Nested routes for "/profile" */}
          </Route>

          {/* Catch all */}
          <Route
            path="*"
            element={
              authToken ? <Navigate to="/profile" /> : <Navigate to="/" />
            }
          />
        </Routes>
      </InteractiveProvider>
    </main>
  );
};

export default App;
