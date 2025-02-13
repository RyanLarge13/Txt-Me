/* Copyright 2024 Ryan Large

 MIT LICENSE

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { TiMessages } from "react-icons/ti";
import { Navigate, Route, Routes } from "react-router-dom";

import ChatsMenu from "./components/ChatsMenu.tsx";
import Messages from "./components/Messages.tsx";
import Nav from "./components/Nav.tsx";
import ProfileNav from "./components/ProfileNav.tsx";
import SysNotif from "./components/SysNotif.tsx";
import { AccountSettingsProvider } from "./context/accountSettingsCtxt.tsx";
import { SocketProvider } from "./context/socketCtxt.tsx";
import UserCtxt from "./context/userCtxt.tsx";
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
  const { user } = useContext(UserCtxt);

  const [mainLoad, setMainLoad] = useState(false);

  useEffect(() => {
    if (mainLoad === true) {
      return;
    }

    // 		// Fetch user was successful, Immediately remove load component
    if (user.authToken && user?.userId !== 0) {
      setMainLoad(false);
    }

    // Currently fetching user data, return (keep load component)
    if (user.authToken && user?.userId === 0) {
      return;
    }

    // No existing user, allow default load component time 1s 250ms
    let timeoutId: number = 0;
    if (!user.authToken && user?.userId === 0) {
      timeoutId = setTimeout(() => {
        setMainLoad(false);
      }, 1250);
    }

    if (user.authToken === null && user === null) {
      setMainLoad(false);
      if (timeoutId !== 0) {
        clearTimeout(timeoutId);
      }
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [user]);

  return (
    <main>
      {/* Loading component */}
      <AnimatePresence>{mainLoad && <MainLoad />}</AnimatePresence>
      {user?.userId ? <ProfileNav /> : <Nav />}
      <SysNotif />
      <Routes>
        {user?.userId ? (
          <Route path="/" element={<Navigate to="/profile" />} />
        ) : (
          <Route path="/" element={<Home />} />
        )}
        <Route path="/login/:type" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/:type/:method" element={<Verify />} />
        <Route
          path="/profile"
          element={
            user?.userId ? (
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
          <Route
            path="account"
            element={
              <AccountSettingsProvider>
                <UserMenu />
              </AccountSettingsProvider>
            }
          />
          <Route path="messages" element={<ChatsMenu />} />
          <Route path="contacts" element={<Messages />} />
          {/* Nested routes for "/profile" */}
        </Route>
        <Route
          path="*"
          element={
            user?.userId ? <Navigate to="/profile" /> : <Navigate to="/" />
          }
        />
      </Routes>
    </main>
  );
};

export default App;
