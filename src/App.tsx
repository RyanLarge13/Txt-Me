import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserCtxt from "./context/userCtxt.tsx";
import Nav from "./components/Nav.tsx";
import Home from "./states/Home.tsx";
import Login from "./states/Login.tsx";
import SignUp from "./states/SignUp.tsx";
import Verify from "./states/Verify.tsx";
import Profile from "./states/Profile.tsx";
import SysNotif from "./components/SysNotif.tsx";

const App = () => {
  const { user } = useContext(UserCtxt);

  return (
    <main>
      <Nav />
      <SysNotif />
      <Routes>
        {user.userId ? (
          <Route path="/" element={<Navigate to="/profile" />} />
        ) : (
          <Route path="/" element={<Home />} />
        )}
        <Route path="/login/:type" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify/:type/:method" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </main>
  );
};

export default App;
