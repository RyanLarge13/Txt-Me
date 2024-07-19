import React, { useContext } from "react";
import { TiMessages } from "react-icons/ti";
import UserCtxt from "../context/userCtxt";
import { useNavigate } from "react-router-dom";

const ProfileNav = (): JSX.Element => {
  const { setOpenChatsMenu } = useContext(UserCtxt);

  const navigate = useNavigate();

  return (
    <header
      className="fixed flex justify-between items-center top-0 right-0 left-0 rounded-b-md shadow-lg p-4
  bg-[#000] z-40"
    >
      <button
        onClick={() => setOpenChatsMenu((prev: boolean): boolean => !prev)}
        className="text-primary text-xl font-bold flex justify-start items-center gap-x-3"
      >
        Txt Me{" "}
        <span>
          <TiMessages />
        </span>
      </button>
      <button
        onClick={() => navigate("/profile/account")}
        className="rounded-full bg-slate-800 text-primary w-9 h-9"
      >
        RL
      </button>
    </header>
  );
};

export default ProfileNav;
