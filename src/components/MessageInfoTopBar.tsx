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

import { motion } from "framer-motion";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FcContacts } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";

import useContextMenu from "../hooks/useContextMenu";
import {
  ContextMenuOptions,
  ContextMenuShowType,
} from "../types/interactiveCtxtTypes";
import { MessageSessionType } from "../types/messageTypes";

const MessageInfoTopBar = ({
  messageSession,
}: {
  messageSession: MessageSessionType;
}) => {
  const contextMenu = useContextMenu();
  const location = useLocation();
  const navigate = useNavigate();

  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const mainOptions: ContextMenuOptions[] = [
      { txt: "Add Contact", icon: <FcContacts />, func: () => {} },
      { txt: "Star Conversation", icon: <FcContacts />, func: () => {} },
      { txt: "Start Conversation", icon: <FcContacts />, func: () => {} },
      { txt: "Delete Messages", icon: <FcContacts />, func: () => {} },
    ];

    const options: ContextMenuOptions[] = [
      { txt: "Add Contact", icon: <FcContacts />, func: () => {} },
      { txt: "Add Contact", icon: <FcContacts />, func: () => {} },
      { txt: "Add Contact", icon: <FcContacts />, func: () => {} },
    ];

    const newMenu: ContextMenuShowType = {
      show: true,
      color: "bg-tri",
      coords: { x: e.clientX, y: e.clientY },
      mainOptions: mainOptions,
      options: options,
    };

    contextMenu.buildContextMenu(newMenu);
  };

  return location.pathname === "/profile" ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() =>
        navigate(`/profile/contacts/${messageSession.contact?.contactid}`)
      }
      className="p-5 text-sm flex fixed top-0 right-0 left-0 z-[999] justify-between items-center bg-black"
    >
      {messageSession.contact && messageSession.contact?.avatar ? (
        <img
          src={URL.createObjectURL(messageSession.contact.avatar)}
          alt="user"
          width={30}
          height={30}
          className="w-[35px] h-[35px] rounded-full object-cover"
        />
      ) : (
        <p className="hover:text-primary duration-200 cursor-pointer">
          {messageSession.contact?.name || messageSession.contact?.nickname}
        </p>
      )}
      <p className="text-tri">
        {messageSession.contact?.number || messageSession.number || ""}
      </p>
      <button onClick={handleContextMenu}>
        <BsThreeDotsVertical />
      </button>
    </motion.div>
  ) : null;
};

export default MessageInfoTopBar;
