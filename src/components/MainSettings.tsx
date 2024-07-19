import React, { useContext } from "react";
import { IoIosArrowForward, IoMdLogOut } from "react-icons/io";

import UserCtxt from "../context/userCtxt";

const MainSettings = ({ setSettingsState, setTitle }) => {
  const { user } = useContext(UserCtxt);

  return (
    <div>
      <div className="mb-10 pb-10 pt-5 border-b-gray-400 border-b flex justify-start items-center gap-x-5">
        <p className="rounded-full bg-slate-800 text-4xl text-primary p-3 w-min">
          RL
        </p>
        <p>{user?.username}</p>
      </div>
      <div className="p-3">
        <p className="text-gray-400 mt-5 text-lg">Account Settings</p>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500">
          Edit Profile
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500">
          Change Username
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500">
          Change Phone Number
          <IoIosArrowForward />
        </button>
      </div>
      <div className="border-b-gray-400 border-b"></div>
      <div className="p-3">
        <p className="text-gray-400 mt-5 text-lg">More</p>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500">
          About Txt Me
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500">
          Privacy Policy
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500">
          Terms Of Service
          <IoIosArrowForward />
        </button>
      </div>
      <div className="border-b-gray-400 border-b"></div>
      <div className="p-3">
        <p className="text-gray-400 mt-5 text-lg">Manage Account</p>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500">
          Report A Problem
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500">
          Incognito
          <IoIosArrowForward />
        </button>
        <button
          onClick={() => {
            setTitle({ string: "Logout", icon: <IoMdLogOut /> });
            setSettingsState({ page: "logout" });
          }}
          className="flex justify-between items-center py-5 w-full hover:text-primary duration-500 text-tri"
        >
          Logout
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full hover:text-primary duration-500 text-secondary">
          Delete Account
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default MainSettings;
