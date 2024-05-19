import React, { useContext } from "react";
import { AnimatePresence } from "framer-motion";
import { TiMessages } from "react-icons/ti";
import UserCtxt from "../context/userCtxt.tsx";
import ProfileNav from "../components/ProfileNav.tsx";
import ChatsMenu from "../components/ChatsMenu.tsx";
import Messages from "../components/Messages.tsx";
import UserMenu from "../components/UserMenu.tsx";

const Profile = (): JSX.Element => {
  const { openChatsMenu, openUserMenu } = useContext(UserCtxt);

  return (
    <main className="mt-20 text-[#fff]">
      <ProfileNav />
      <AnimatePresence>{openUserMenu ? <UserMenu /> : null}</AnimatePresence>
      <AnimatePresence>{openChatsMenu ? <ChatsMenu /> : null}</AnimatePresence>
      <Messages />
      <button className="bg-primary text-[#000] font-bold p-3 rounded-full fixed bottom-10 right-10 z-40">
        <TiMessages />
      </button>
    </main>
  );
};

export default Profile;
