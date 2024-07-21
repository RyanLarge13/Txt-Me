import React, { useContext } from "react";
import { TiMessages } from "react-icons/ti";
import { Outlet } from "react-router-dom";
import UserCtxt from "../context/userCtxt.tsx";
import ProfileNav from "../components/ProfileNav.tsx";
import BottomNav from "../components/BottomNav.tsx";
import MessageSession from "../components/MessageSession.tsx";

const Profile = (): JSX.Element => {
  const { messageSession } = useContext(UserCtxt);

  return (
    <main className="mt-20 text-[#fff]">
      <ProfileNav />
      <div className="flex justify-center items-center absolute inset-0 outline outline-red-300">
        {messageSession !== null ? (
          <MessageSession session={messageSession} />
        ) : (
          <p className="text-primary text-9xl">
            <TiMessages />
          </p>
        )}
      </div>
      <BottomNav />
      <Outlet />
    </main>
  );
};

export default Profile;
