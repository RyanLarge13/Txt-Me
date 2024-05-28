import React, { useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { TiMessages } from "react-icons/ti";
import { Outlet } from "react-router-dom";
import UserCtxt from "../context/userCtxt.tsx";
import ProfileNav from "../components/ProfileNav.tsx";
import Messages from "../components/Messages.tsx";
import UserMenu from "../components/UserMenu.tsx";
import ChatsMenu from "../components/ChatsMenu.tsx";

const Profile = (): JSX.Element => {
  const { openChatsMenu, setNewChat, openUserMenu } = useContext(UserCtxt);

  return (
    <main className="mt-20 text-[#fff]">
      <ProfileNav />
      <AnimatePresence>{openChatsMenu ? <ChatsMenu /> : null}</AnimatePresence>
      <AnimatePresence>{openUserMenu ? <UserMenu /> : null}</AnimatePresence>
      <Messages />
      <button
        onClick={() => setNewChat(true)}
        className="bg-primary text-[#000] font-bold p-3 rounded-full fixed
      bottom-5 right-5
      md:bottom-10 md:right-10 z-40"
      >
        <TiMessages />
      </button>
      <Outlet />
    </main>
  );
};

export default Profile;
