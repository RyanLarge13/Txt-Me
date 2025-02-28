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
import { FaHome } from "react-icons/fa";
import { IoMdContacts, IoMdSettings } from "react-icons/io";
import { TiMessages } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNav = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed justify-center items-center bg-black bottom-0 right-0 left-0 flex z-[999]">
      <button
        onClick={() => navigate("/profile")}
        className={`flex-1 flex justify-center items-center p-5 text-xl duration-300 ${
          location.pathname === "/profile"
            ? "bg-tri text-black rounded-t-full"
            : "bg-black text-white"
        }`}
      >
        <FaHome />
      </button>
      <button
        onClick={() => navigate("/profile/messages")}
        className={`flex-1 flex justify-center items-center p-5 text-xl duration-300 ${
          location.pathname === "/profile/messages"
            ? "bg-tri text-black rounded-t-full"
            : "bg-black text-white"
        }`}
      >
        <TiMessages />
      </button>
      <button
        onClick={() => navigate("/profile/contacts")}
        className={`flex-1 flex justify-center items-center p-5 text-xl duration-300 ${
          location.pathname === "/profile/contacts"
            ? "bg-tri text-black rounded-t-full"
            : "bg-black text-white"
        }`}
      >
        <IoMdContacts />
      </button>
      <button
        onClick={() => navigate("/profile/account")}
        className={`flex-1 flex justify-center items-center p-5 text-xl duration-300 ${
          location.pathname === "/profile/account"
            ? "bg-tri text-black rounded-t-full"
            : "bg-black text-white"
        }`}
      >
        <IoMdSettings />
      </button>
    </nav>
  );
};

export default BottomNav;
