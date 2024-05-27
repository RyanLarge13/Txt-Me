import React, { useContext } from "react";
import { TiMessages } from "react-icons/ti";
import {useNavigate, useLocation } from "react-router-dom"
import UserCtxt from "../context/userCtxt";

const ProfileNav = (): JSX.Element => {
  const { setOpenChatsMenu, setOpenUserMenu, user } = useContext(UserCtxt);
  
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header
      className="fixed flex justify-between items-center top-0 right-0 left-0 rounded-b-md shadow-lg p-3
  bg-[#000] z-40"
    >
      <button
        onClick={() => {
         if (location.pathname === "profile/chatmenu") {
          navigate("/profile")
         }
         else {
          navigate("/profile/chatsmenu")
         }
        }}
        className="text-primary text-xl font-bold flex justify-start items-center gap-x-3"
      >
        Txt Me{" "}
        <span>
          <TiMessages />
        </span>
      </button>
      <button onClick={() => setOpenUserMenu((prev): boolean => !prev)}>
        {user?.username}
      </button>
    </header>
  );
};

export default ProfileNav;
