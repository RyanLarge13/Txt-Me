import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TiMessages } from "react-icons/ti";
import { SocketProvider } from "./context/socketCtxt.tsx";
import UserCtxt from "./context/userCtxt.tsx";
import Nav from "./components/Nav.tsx";
import Home from "./states/Home.tsx";
import Login from "./states/Login.tsx";
import SignUp from "./states/SignUp.tsx";
import Verify from "./states/Verify.tsx";
import Profile from "./states/Profile.tsx";
import SysNotif from "./components/SysNotif.tsx";
import ProfileNav from "./components/ProfileNav.tsx";
import NewContact from "./states/NewContact.tsx";
import { AccountSettingsProvider } from "./context/accountSettingsCtxt.tsx";
import UserMenu from "./states/UserMenu.tsx";
import Messages from "./components/Messages.tsx";
import ChatsMenu from "./components/ChatsMenu.tsx";

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
  const { user, token } = useContext(UserCtxt);

  const [mainLoad, setMainLoad] = useState(true);

  useEffect(() => {
    // Fetch user was successful, Immediately remove load component
    if (token && user?.userId !== 0) {
      setMainLoad(false);
    }

    // Currently fetching user data, return (keep load component)
    if (token && user?.userId === 0) {
      return;
    }

    // No existing user, allow default load component time 1s 250ms
    let timeoutId: number;
    if (!token && user?.userId === 0) {
      timeoutId = setTimeout(() => {
        setMainLoad(false);
      }, 1250);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [token, user]);

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
