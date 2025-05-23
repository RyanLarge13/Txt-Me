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
import { useLocation, useNavigate } from "react-router-dom";

import { MessageSessionType } from "../types/userTypes";

const MessageInfoTopBar = ({
  messageSession,
}: {
  messageSession: MessageSessionType;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return location.pathname === "/profile" ? (
    <button
      onClick={() =>
        navigate(`/profile/contacts/${messageSession.contact?.contactid}`)
      }
      className="p-5 text-sm flex fixed top-0 right-0 left-0 z-[999] justify-between items-center bg-black"
    >
      <p className="hover:text-primary duration-200 cursor-pointer">
        {messageSession.contact?.name || messageSession.number}
      </p>
      <p className="text-tri">{messageSession.contact?.number || ""}</p>
    </button>
  ) : null;
};

export default MessageInfoTopBar;
