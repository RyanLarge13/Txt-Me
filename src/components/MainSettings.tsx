import React, { useContext } from "react";
import { IoIosArrowForward, IoMdLogOut } from "react-icons/io";

import UserCtxt from "../context/userCtxt";

const MainSettings = ({ setSettingsState, setTitle }) => {
  const { user } = useContext(UserCtxt);

  return (
    <div>
      <div className="mb-10 pb-10 pt-5 border-b-gray-400 border-b">
        <p>{user?.username}</p>
      </div>
      <div className="p-3">
        <p className="text-gray-400 mt-5">Account Settings</p>
        <button className="flex justify-between items-center py-5 w-full">
          Edit Profile
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full">
          Change Username
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full">
          Edit Profile
          <IoIosArrowForward />
        </button>
      </div>
      <div className="border-b-gray-400 border-b"></div>
      <div className="p-3">
        <p className="text-gray-400 mt-5">More</p>
        <button className="flex justify-between items-center py-5 w-full">
          About Txt Me
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full">
          Privacy Policy
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full">
          Terms Of Service
          <IoIosArrowForward />
        </button>
      </div>
      <div className="border-b-gray-400 border-b"></div>
      <div className="p-3">
        <p className="text-gray-400 mt-5">Manage Account</p>
        <button className="flex justify-between items-center py-5 w-full">
          Report A Problem
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full">
          Incognito
          <IoIosArrowForward />
        </button>
        <button
          onClick={() => {
            setTitle({ string: "Logout", icon: <IoMdLogOut /> });
            setSettingsState({ page: "logout" });
          }}
          className="flex justify-between items-center py-5 w-full text-tri"
        >
          Logout
          <IoIosArrowForward />
        </button>
        <button className="flex justify-between items-center py-5 w-full text-secondary">
          Delete Account
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default MainSettings;
