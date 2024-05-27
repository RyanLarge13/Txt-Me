import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TiMessages } from "react-icons/ti";
import UserCtxt from "./context/userCtxt.tsx";
import Nav from "./components/Nav.tsx";
import Home from "./states/Home.tsx";
import Login from "./states/Login.tsx";
import SignUp from "./states/SignUp.tsx";
import Verify from "./states/Verify.tsx";
import Profile from "./states/Profile.tsx";
import SysNotif from "./components/SysNotif.tsx";
import ProfileNav from "./components/ProfileNav.tsx";
import ChatsMenu from "./components/ChatsMenu.tsx";

const MainLoad = () => {
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
     transition: { duration: 0.75, type: "spring" }
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

 const [mainLoad, setMainLoad] = useState(true);

 useEffect(() => {
  setTimeout(() => {
   setMainLoad(false);
  }, 1000);
 }, []);

 return (
  <main>
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
     element={user?.userId ? <Profile /> : <Navigate to="/" />}
    >
     <Route
      path="chatmenu"
      element={
       <AnimatePresence>
        <ChatsMenu />
       </AnimatePresence>
      }
     />
     {/* <Route path="" element={} />*/}
    </Route>
    <Route
     path="*"
     element={user?.userId ? <Navigate to="/profile" /> : <Navigate to="/" />}
    />
   </Routes>
  </main>
 );
};

export default App;
