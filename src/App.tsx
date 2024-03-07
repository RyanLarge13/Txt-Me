import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userCtxt.tsx";
import Nav from "./components/Nav.tsx";
import Home from "./states/Home.tsx";
import Login from "./states/Login.tsx";
import SignUp from "./states/SignUp.tsx";
import Verify from "./states/Verify.tsx";
import Profile from "./states/Profile.tsx";
import SysNotif from "./components/SysNotif.tsx";

const App = () => {
 return (
  <Router>
   <UserProvider>
    <Nav />
    <SysNotif />
    <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/login/:type" element={<Login />} />
     <Route path="/signup" element={<SignUp />} />
     <Route path="/verify/:type/:method" element={<Verify />} />
     <Route path="/profile" element={<Profile />} />
    </Routes>
   </UserProvider>
  </Router>
 );
};

export default App;
