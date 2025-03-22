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
import { TiMessages } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

import { useConfig } from "../context/configContext";
import { getInitials } from "../utils/helpers";

const ProfileNav = (): JSX.Element => {
  const { getUserData } = useConfig();
  const navigate = useNavigate();

  const username = getUserData("username");

  return (
    <header
      className="fixed flex justify-between items-center top-0 right-0 left-0 rounded-b-md shadow-lg p-4
  bg-[#000] z-40"
    >
      <button
        onClick={() => navigate("/profile/messages")}
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
        {getInitials(username)}
      </button>
    </header>
  );
};

export default ProfileNav;
