import React from "react";
import { FaHome } from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { IoMdContacts, IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const BottomNav = (): JSX.Element => {
 const navigate = useNavigate();

 return (
  <nav className="fixed flex justify-center items-center bottom-0 right-0 left-0 flex z-40">
   <button
    onClick={() => navigate("/profile")}
    className="flex-1 flex justify-center items-center text-white p-5 text-xl"
   >
    <FaHome />
   </button>
   <button
    onClick={() => navigate("/messages")}
    className="flex-1 flex justify-center items-center text-white p-5 text-xl"
   >
    <TiMessages />
   </button>
   <button
    onClick={() => navigate("/contacts")}
    className="flex-1 flex justify-center items-center text-white p-5 text-xl"
   >
    <IoMdContacts />
   </button>
   <button onClick={() => navigate("/profile/account")} className="flex-1 flex justify-center items-center text-white p-5 text-xl">
    <IoMdSettings />
   </button>
  </nav>
 );
};

export default BottomNav;
