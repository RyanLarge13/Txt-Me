/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import React from "react";
import { IoIosArrowForward, IoMdLogOut } from "react-icons/io";

import useUserData from "../hooks/useUserData";

const MainSettings = ({ setSettingsState, setTitle }) => {
  const [username] = useUserData("username");

  return (
    <div>
      <div className="mb-10 pb-10 pt-5 border-b-gray-400 border-b flex justify-start items-center gap-x-5">
        <p className="rounded-full bg-slate-800 text-4xl text-primary p-3 w-min">
          RL
        </p>
        <p>{username}</p>
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
